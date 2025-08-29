import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from 'http-status-codes'
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";



const createUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    

    const user =await UserServices.createUser(req.body)

    
     
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"User created successfully",
        data:user
    })
 

})

const getAllUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

 
    const result =  await UserServices.getAllUsers()

    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"All user retrieved successfully",
        data:result.data,
        meta:result.meta
    })

}
)
export  const UserController = {
    createUser,getAllUser
}