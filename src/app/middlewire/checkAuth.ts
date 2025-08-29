
import { NextFunction, Request, Response } from 'express';
import  httpStatus  from 'http-status-codes';
import AppError from '../errorHelpers/AppError';
import { verifyToken } from '../utils/jwt';
import { envVars } from '../config/env';
import { JwtPayload } from 'jsonwebtoken';

export const checkAuth=(...authRoles: string[])=>async(req:Request,res:Response,next:NextFunction)=>{

    try {
        const accessToken = req.headers.authorization
    if(!accessToken){
        throw new AppError(httpStatus.UNAUTHORIZED,"You are not authorized")
    }
    const verifiedToken = verifyToken(accessToken,envVars.JWT_ACCESS_SECRET) as JwtPayload

    if(!authRoles.includes(verifiedToken.role)){
        throw new AppError(httpStatus.FORBIDDEN,"You don't have access of this route")
    }
    next()

    } catch (error) {
        next(error)
    }

}