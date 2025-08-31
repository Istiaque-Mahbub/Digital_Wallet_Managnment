import AppError from "../../errorHelpers/AppError"
import { IS_ACTIVE, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import  httpStatus  from 'http-status-codes';
import bcryptjs from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createUserTokens } from "../../utils/userToken";


const credentialLogin = async(payload:Partial<IUser>)=>{
   const {email , password} = payload

   const isUserExist  = await User.findOne({email})

   if(!isUserExist){
    throw new AppError(httpStatus.BAD_REQUEST,"User Doesn't Exists")
   }

   const isPasswordMatch = await bcryptjs.compare(password as string,isUserExist.password)

   if(!isPasswordMatch){
    throw new AppError(httpStatus.BAD_REQUEST,"Incorrect password")
   }

  const userTokens =  createUserTokens(isUserExist)

   const {password : pass,...rest}= isUserExist.toObject()

   return {
         email:isUserExist.email,
         accessToken:userTokens.accessToken,
         refreshToken:userTokens.refreshToken,
         user:rest
   }
}

const getNewAccessToken = async(refreshToken:string)=>{
    const verifiedRefreshToken =  verifyToken(refreshToken,envVars.JWT_REFRESH_SECRET) as JwtPayload
 
    const isUserExist  = await User.findOne({email:verifiedRefreshToken.email})
 
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
 
       const jwtPayload = {
        userId:isUserExist._id,
        email:isUserExist.email,
        role:isUserExist.role
       }
    
       const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
 
 
    return {
          email:isUserExist.email,
          accessToken
          
    }
 }

export const  AuthServices = {
    credentialLogin,getNewAccessToken
}