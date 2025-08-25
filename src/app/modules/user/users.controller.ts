import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from 'http-status-codes'
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";



const createUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    

    const user =await UserServices.createUser(req.body)

     res.status(httpStatus.CREATED).json({
         message:'User cerated successfully',
         user
     })
     
 

})

const getAllUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

 
    const users =  await UserServices.getAllUsers()

    res.status(httpStatus.OK).json({
        message:'All Users Retrieved Successfully',
        users
    })
 

}
)
export  const UserController = {
    createUser,getAllUser
}