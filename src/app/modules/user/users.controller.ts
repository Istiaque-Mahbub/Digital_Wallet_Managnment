import { NextFunction, Request, Response } from "express";
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
    const token = req.headers.authorization || req.cookies.accessToken
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

   
    const token = req.headers.authorization || req.cookies.accessToken
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

const agentRequestAddMoney = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

   
    const token = req.headers.authorization ||  req.cookies.accessToken
    const verifiedToken = verifyToken(token as string,envVars.JWT_ACCESS_SECRET) as JwtPayload
    const userId = verifiedToken.userId 
    const amount = Number(req.body.amount)


    const user = await UserServices.agentRequestAddMoney(userId!,amount)

    
     
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


const getUserByPhone = catchAsync(async (req: Request, res: Response) => {
    const {number} = req.params;
  
    const user = await UserServices.findUserByPhone(number);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User fetched successfully by phone",
      data: user,
    });
  });

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization || req.cookies.accessToken
    const verifiedToken = verifyToken(token as string,envVars.JWT_ACCESS_SECRET) as JwtPayload
    const userId = verifiedToken.userId 
    const result = await UserServices.getMe(userId);

    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})
export  const UserController = {
    createUser,getAllUser,updateUser,requestForAgent,agentRequestAddMoney,getMe,getUserByPhone
}