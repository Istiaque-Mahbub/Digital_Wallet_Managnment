import AppError from "../../errorHelpers/AppError"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import  httpStatus  from 'http-status-codes';
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";


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
    credentialLogin
}