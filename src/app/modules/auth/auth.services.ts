import AppError from "../../errorHelpers/AppError"
import { IS_ACTIVE, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import  httpStatus  from 'http-status-codes';
import bcryptjs from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createUserTokens, newAccessTokenWithRefreshToken } from "../../utils/userToken";


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
    
    const accessToken = newAccessTokenWithRefreshToken(refreshToken)
 
 
    return {
          
          accessToken
          
    }
 }

export const  AuthServices = {
    credentialLogin,getNewAccessToken
}