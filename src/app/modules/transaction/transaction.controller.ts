import { NextFunction, Request, Response } from "express"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"
import { verifyToken } from "../../utils/jwt"
import { TransactionServices } from "./transaction.services"
import { sendResponse } from "../../utils/sendResponse"
import  httpStatus  from 'http-status-codes';



const sendMoney = async(req:Request,res:Response,next:NextFunction) =>{

    const token = req.headers.authorization
    const receiverId = req?.body?.receiverId 
    const amount = Number(req?.body?.amount)
    const verifiedToken = verifyToken(token as string,envVars.JWT_ACCESS_SECRET) as JwtPayload 
    const decodedToken = req.user
    const senderId = decodedToken.userId

    

    const result = await TransactionServices.sendMoney(senderId,receiverId,amount)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Money send successfully",
        data:result
    })
}

const cashIn = async(req:Request,res:Response,next:NextFunction)=>{

    const decodedToken = req.user
    const agentId = decodedToken.userId
    const receiverId = req.body.receiverId
    const amount = Number(req.body.amount)

    const result = await TransactionServices.cashIn(agentId,receiverId,amount)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Cash In successfully",
        data:result
    })
}


const cashOut = async(req:Request,res:Response,next:NextFunction)=>{

    const decodedToken = req.user
    const agentId = decodedToken.userId
    const receiverId = req.body.receiverId
    const amount = Number(req.body.amount)

    const result = await TransactionServices.cashOut(agentId,receiverId,amount)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Cash Out successfully",
        data:result
    })
}

export const TransactionController = {
    sendMoney,cashIn,cashOut
}