import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from 'http-status-codes'
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";



const createUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    

    const user =await UserServices.createUser(req.body)

    
     
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"User created successfully",
        data:user
    })
 

})


const updateUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const userId = req.params.id
    const token = req.headers.authorization
    const verifiedToken = verifyToken(token as string,envVars.JWT_ACCESS_SECRET) as JwtPayload
    const payload = req.body
    

    const user =await UserServices.updateUser(userId,payload,verifiedToken)

    
     
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"User updated successfully",
        data:user
    })
 

})

const requestForAgent = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

   
    const token = req.headers.authorization
    const verifiedToken = verifyToken(token as string,envVars.JWT_ACCESS_SECRET) as JwtPayload
    const userId = verifiedToken.userId 


    const user = await UserServices.requestForAgent(userId!)

    
     
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Request for agent successfully",
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
    createUser,getAllUser,updateUser,requestForAgent
}