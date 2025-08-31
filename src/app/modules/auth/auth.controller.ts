import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import  httpStatus  from 'http-status-codes';
import { AuthServices } from "./auth.services";
import AppError from "../../errorHelpers/AppError";


const credentialLogin = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    

    const logInfo = await AuthServices.credentialLogin(req?.body)

    res.cookie("accessToken",logInfo.accessToken,{httpOnly:true,secure:false})
    
    res.cookie("refreshToken",logInfo.refreshToken,{httpOnly:true,secure:false})
     
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Login Successfully",
        data:logInfo
    })
 

})

const getNewAccessToken = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const refreshToken =  req.cookies.refreshToken

    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST,"No refresh token received!!")
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)
    
     
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Login Successfully",
        data:tokenInfo
    })
 

})

export const  AuthControllers = {
    credentialLogin,getNewAccessToken
}