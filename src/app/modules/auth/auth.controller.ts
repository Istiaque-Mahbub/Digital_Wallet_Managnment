import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import  httpStatus  from 'http-status-codes';
import { AuthServices } from "./auth.services";


const credentialLogin = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    

    const logInfo = await AuthServices.credentialLogin(req?.body)
    
     
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Login Successfully",
        data:logInfo
    })
 

})

export const  AuthControllers = {
    credentialLogin
}