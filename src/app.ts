import express, { NextFunction, Request, Response } from "express";
import { UserRoutes } from "./app/modules/user/users.routes";
import cors from "cors";
import { router } from "./app/routes";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewire/globalErrorHandler";
import  httpStatus  from 'http-status-codes';
import { notFound } from "./app/middlewire/notFound";
import cookieParser from "cookie-parser";


const app = express();

app.use(cookieParser())

app.use(express.json());

app.set("trust proxy",1)

app.use(cors({
  origin:envVars.FRONT_URL,
  credentials:true
}));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Digital wallet is running",
  });
});


app.use(globalErrorHandler)

app.use(notFound)

export default app;
