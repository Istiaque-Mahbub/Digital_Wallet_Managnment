
import { NextFunction, Request, Response } from 'express';
import  httpStatus  from 'http-status-codes';
import AppError from '../errorHelpers/AppError';
import { verifyToken } from '../utils/jwt';
import { envVars } from '../config/env';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import { IS_ACTIVE } from '../modules/user/user.interface';

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

    const isUserExist  = await User.findOne({email:verifiedToken.email})
 
    if(!isUserExist){
     throw new AppError(httpStatus.BAD_REQUEST,"User Doesn't Exists")
    }

    if(isUserExist.isActive === IS_ACTIVE.BLOCKED ){
        throw new AppError(httpStatus.BAD_REQUEST,"User is blocked")
       }
    if(isUserExist.isActive === IS_ACTIVE.INACTIVE ){
        throw new AppError(httpStatus.BAD_REQUEST,"User is inactive")
       }

       if( isUserExist.isDeleted ){
        throw new AppError(httpStatus.BAD_REQUEST,"User is deleted")
       }

    req.user = verifiedToken

    next()

    } catch (error) {
        next(error)
    }

}