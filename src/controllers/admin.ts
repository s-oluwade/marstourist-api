import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import AdminModel from "../models/admin";
import UserModel from "../models/user";

export const getAdmin: RequestHandler = async (req, res, next) => {

    try {
        const admin = await AdminModel.findById(req.session.adminId).select("+email").exec();
        res.status(200).json(admin);
    } catch (error) {
        res.json(null);
    }
};

export const getUsers: RequestHandler = async (req, res, next) => {
    // admin already verified. just fetch users
    try {
        const users = await UserModel.find({}).select("+email").exec();
        res.status(200).json([users]);
    } catch (error) {
        next(error);
    }
};

interface AdminLoginBody {
    name?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, AdminLoginBody, unknown> = async (req, res, next) => {

    const name = req.body.name;
    const password = req.body.password;

    try {
        if (!name || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const admin = await AdminModel.findOne({ name: name }).select("+password +email").exec();

        if (!admin) {
            throw createHttpError(401, "Admin not found");
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid password");
        }

        req.session.adminId = admin._id;

        res.status(201).json(admin);

    } catch (error) {
        next(error);
    }
};

interface AdminRegisterBody extends AdminLoginBody {
    email?: string,
}

export const register: RequestHandler<unknown, unknown, AdminRegisterBody, unknown> = async (req, res, next) => {
    
    const name = req.body.name;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if (!name || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingEmail = await AdminModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "An admin with this email address already exists.");
        }

        if (name) {
            const existingAdminName = await AdminModel.findOne({ name: name }).exec();
            if (existingAdminName) {
                throw createHttpError(409, "An admin with this name already exists. Please choose a different one or log in instead.");
            }
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const admin = await AdminModel.create({
            name: name,
            email: email,
            password: passwordHashed,
        });

        req.session.adminId = admin._id;
        
        res.status(201).json(admin);

    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};
