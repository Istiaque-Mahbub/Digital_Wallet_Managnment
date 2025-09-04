import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./users.controller";
import { validateRequest } from "../../utils/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
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
router.post('/agent-request',checkAuth(ROLE.USER),UserController.requestForAgent)
router.patch("/:id",checkAuth(...Object.values(ROLE)),validateRequest(updateUserZodSchema),UserController.updateUser)

export const UserRoutes = router