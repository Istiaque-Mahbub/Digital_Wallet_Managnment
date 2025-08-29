import AppError from "../../errorHelpers/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import  httpStatus  from 'http-status-codes';
import bcryptjs from 'bcryptjs'


const createUser =async (payload:Partial<IUser>) =>{
    const {email,password,...rest}= payload

 const    isUserExist =await User.findOne({email})
 
 if(isUserExist){
       throw new AppError(httpStatus.CONFLICT,"User already exist ")
 }

 const hashedPassword =await bcryptjs.hash(password as string,10)

//  const isPasswordMatch = await bcryptjs.compare(password as string,hashedPassword)

    const user = await User.create({
        email,
        password:hashedPassword,
        ...rest
    })

    return user
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
    createUser,getAllUsers
}