import AppError from "../../errorHelpers/AppError";
import { IS_ACTIVE, IUser, ROLE } from "./user.interface";
import { User } from "./user.model";
import  httpStatus  from 'http-status-codes';
import bcryptjs from 'bcryptjs'
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import mongoose from "mongoose";
import { SSLService } from "../../sslCommerz/sslCommerz.service";
import { ISslCommerz } from "../../sslCommerz/sslCommerz.interface";


const getTransactionId = () =>{
    return `tran_${Date.now()}_${Math.floor(Math.random()*1000)}`
}


const createUser =async (payload:Partial<IUser>) =>{

    

    const {email,password,...rest}= payload

    const session = await User.startSession()
    session.startTransaction()

 try {
    const    isUserExist =await User.findOne({email})
 
 if(isUserExist){
       throw new AppError(httpStatus.CONFLICT,"User already exist ")
 }

 const hashedPassword =await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND))



    const user = await User.create([{
        email,
        password:hashedPassword,
        ...rest
    }],{session})

    const wallet = await Wallet.create([{
        userId:user[0]?._id,
    }],{session})

    const updatedUser = await User
            .findByIdAndUpdate(
                user[0]?._id,
                { wallet: wallet[0]?._id },
                { new: true, runValidators: true,session }
            )
            .populate("wallet")

            await session.commitTransaction()
            session.endSession()


    return updatedUser
 } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
 }
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



const requestForAgent = async(userId:string)=>{
    
    const transactionId = getTransactionId()
    const agentMoney = 10000

    const session = await mongoose.startSession();
session.startTransaction();
    try {


        const isUserExist = await User.findById(userId).session(session);

       

        if(isUserExist?.payment){
            throw new AppError(httpStatus.CONFLICT,"You already requested for it once before")
        }

        if(isUserExist?.role === ROLE.AGENT){
            throw new AppError(httpStatus.CONFLICT,"You are already an agent")
        }

        if(isUserExist?.isActive === IS_ACTIVE.BLOCKED ){
            throw new AppError(httpStatus.UNAUTHORIZED,"You are not active user")
        }

        if(isUserExist?.isActive === IS_ACTIVE.INACTIVE ){
            throw new AppError(httpStatus.UNAUTHORIZED,"You are not active user")
        }

        if(isUserExist?.isDeleted){
            throw new AppError(httpStatus.UNAUTHORIZED,"You are not allowed")
        }

        const payment = await Payment.create([{
            user:userId,
            wallet:isUserExist?.wallet,
            status:PAYMENT_STATUS.UNPAID,
            transactionId:transactionId,
            amount:agentMoney
        }],{session})

        const updatedUser = await User.findByIdAndUpdate(userId,{
            payment:payment[0]._id
        },{new:true,runValidators:true}).populate("payment") 
        const userEmail = isUserExist?.email as string
        const userPhone = isUserExist?.phone as string
        const username = isUserExist?.name as string

        const sslPayload:ISslCommerz = {
          phoneNumber:userPhone,
          email:userEmail,
          amount:agentMoney,
          name:username,
          transactionId:transactionId
        }

        const sslPayment = await SSLService.sslPaymentInit(sslPayload)

        await session.commitTransaction()
        session.endSession()

        return {
            user:updatedUser,
            paymentUrl:sslPayment.GatewayPageURL
        }

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

export const UserServices = {
    createUser,getAllUsers,updateUser,requestForAgent
}