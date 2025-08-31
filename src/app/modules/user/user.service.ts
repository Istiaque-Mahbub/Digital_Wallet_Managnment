import AppError from "../../errorHelpers/AppError";
import { IUser, ROLE } from "./user.interface";
import { User } from "./user.model";
import  httpStatus  from 'http-status-codes';
import bcryptjs from 'bcryptjs'
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";



const createUser =async (payload:Partial<IUser>) =>{
    const {email,password,...rest}= payload

 const    isUserExist =await User.findOne({email})
 
 if(isUserExist){
       throw new AppError(httpStatus.CONFLICT,"User already exist ")
 }

 const hashedPassword =await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND))



    const user = await User.create({
        email,
        password:hashedPassword,
        ...rest
    })

    return user
}


const updateUser = async(userId:string,payload:Partial<IUser>,decodedToken:JwtPayload)=>{

    const isUserExist = await User.findById(userId)

    if(!isUserExist){
        throw new AppError(httpStatus.NOT_FOUND,"User not found")
    }

   if(payload.email || payload.nidNumber || payload.phone){
    throw new AppError(httpStatus.BAD_REQUEST,"You don't allow to change email,nidNumber,phone number")
    return
   }

    if(payload.role){
        if(decodedToken.role ===ROLE.USER || decodedToken.role === ROLE.AGENT){
            throw new AppError(httpStatus.UNAUTHORIZED,"You are not allow to change role")
        }
        if(payload.role===ROLE.SUPER_ADMIN && decodedToken.role === ROLE.ADMIN){
            throw new AppError(httpStatus.UNAUTHORIZED,"You are not allow to change role")
        }
    }

    if(payload.isActive || payload.isDeleted || payload.isVerified){
        if(decodedToken.role ===ROLE.USER || decodedToken.role === ROLE.AGENT){
            throw new AppError(httpStatus.UNAUTHORIZED,"You are not allow to change role")
        }
    }

    if(payload.password){
        payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId,payload,{new:true,runValidators:true})

    return newUpdatedUser

}

const getAllUsers = async()=>{
    const users = await User.find({})

    const totalUser = await User.countDocuments()

    return{
        data:users,
        meta:{
            total:totalUser
        }
    }
}

export const UserServices = {
    createUser,getAllUsers,updateUser
}