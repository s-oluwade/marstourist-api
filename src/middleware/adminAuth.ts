import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAdminAuth: RequestHandler = (req, res, next) => {
    if (req.session.adminId) {
        next();
    } else {
        next(createHttpError(401, "Admin not authenticated"));
    }
};