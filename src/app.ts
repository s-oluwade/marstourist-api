import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";
import cartRoutes from "./routes/cart";
import productRoutes from "./routes/products";
import activityRoutes from "./routes/activities";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
const cookieParser = require('cookie-parser');
const app = express();
const port = env.PORT;

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// CORS configuration
const cors = require('cors');
app.use(cors({
    credentials: true,
<<<<<<< HEAD
    origin: ['https://marstourist.azurewebsites.net', 'http://localhost', 'http://localhost:80'],
    // origin: 'https://marstourist.azurewebsites.net'
=======
    origin: [env.CLIENT_DOMAIN],
>>>>>>> 1ccf00ab75301c8ac2df654c45e8ede5afb83e3c
}));

// Session cookie configuration
let cookieSourceConfig: session.CookieOptions = { sameSite: 'lax' };
if (env.ENVIRONMENT === "production") {
    app.set('trust proxy', 1);
    cookieSourceConfig = { sameSite: 'none', secure: true }
}

// Session configuration
app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
        ...cookieSourceConfig
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}));

app.use("/", express.static("public"));
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/sales", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/activities", activityRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;