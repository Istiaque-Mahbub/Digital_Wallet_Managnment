import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import  httpStatus  from 'http-status-codes';
import { AuthServices } from "./auth.services";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";


const credentialLogin = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    

    const logInfo = await AuthServices.credentialLogin(req?.body)

    res.cookie("accessToken",logInfo.accessToken,{httpOnly:true,secure: true,
        sameSite:"none" })
    
    res.cookie("refreshToken",logInfo.refreshToken,{httpOnly:true,secure: true,
        sameSite:"none" })
     
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
    
    res.cookie("accessToken",tokenInfo.accessToken,{httpOnly:true,
        secure:true,
        sameSite:"none" 
    })
     
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"New Access token created successfully",
        data:tokenInfo
    })
 

})

const logout = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    res.clearCookie("accessToken",{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })

    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })
     
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Logout successfully",
        data:{}
    })
 

})

const resetPassword = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const oldPassword = req.body.oldPassword

    const newPassword = req.body.newPassword

    const decodedToken = req.user

     await AuthServices.resetPassword(oldPassword,newPassword,decodedToken)
     
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Password changed successfully",
        data:{}
    })
 

})

export const  AuthControllers = {
    credentialLogin,getNewAccessToken,logout,resetPassword
}