import express, { NextFunction, Request, Response } from "express";
import { UserRoutes } from "./app/modules/user/users.routes";
import cors from "cors";
import { router } from "./app/routes";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewire/globalErrorHandler";
import  httpStatus  from 'http-status-codes';
import { notFound } from "./app/middlewire/notFound";


const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Digital wallet is running",
  });
});


app.use(globalErrorHandler)

app.use(notFound)

export default app;
