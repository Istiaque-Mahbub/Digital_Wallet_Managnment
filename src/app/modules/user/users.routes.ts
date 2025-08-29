import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./users.controller";
import { validateRequest } from "../../utils/validateRequest";
import { createUserZodSchema } from "./user.validation";
import jwt, { JwtPayload } from "jsonwebtoken"
import AppError from "../../errorHelpers/AppError";
import httpStatus  from 'http-status-codes';
import { ROLE } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewire/checkAuth";

const router = Router()



router.post('/register',validateRequest(createUserZodSchema),UserController.createUser)
router.get('/all-users',checkAuth(ROLE.ADMIN,ROLE.SUPER_ADMIN),UserController.getAllUser)

export const UserRoutes = router