import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { ISslCommerz } from "../../sslCommerz/sslCommerz.interface";
import { SSLService } from "../../sslCommerz/sslCommerz.service";
import { ROLE } from "../user/user.interface";
import { User } from "../user/user.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import  httpStatus  from 'http-status-codes';
import { Wallet } from "../wallet/wallet.model";

const initPayment = async(userId:string)=>{
    
    const payment = await Payment.findOne({user:userId})
    if(!payment){
        throw new AppError(httpStatus.BAD_REQUEST,"Payment information not found")
    }

    const user = await User.findById(payment.user)

    
        const userEmail = user?.email as string
        const userPhoneNumber = user?.phone as string
        const userName = user?.name as string
        const sslPayload :ISslCommerz = {
             email:userEmail,
             phoneNumber:userPhoneNumber,
             name:userName,
             amount:payment.amount,
             transactionId:payment.transactionId
        }
    
        const sslPayment = await SSLService?.sslPaymentInit(sslPayload)

        return{
            paymentUrl:sslPayment.GatewayPageURL
        }

}

const successPayment = async (query: Record<string, string>) => {


    const session = await mongoose.startSession();
    session.startTransaction()

    try {


        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.PAID,
        }, { runValidators: true, session: session })

        const user = updatedPayment?.user

        const wallet = await Wallet.findOne({userId:user})

        await User
            .findByIdAndUpdate(
                updatedPayment?.user,
                { role: ROLE.AGENT },
                { runValidators: true, session }
            )

            await Wallet
            .findByIdAndUpdate(
                wallet,
                { $inc: { agentMoney: updatedPayment?.amount } } ,
                { runValidators: true, session }
            )

        await session.commitTransaction(); //transaction
        session.endSession()
        return { success: false, message: "Payment Successfully" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()
        throw error
    }
};
const failPayment = async (query: Record<string, string>) => {
    const session = await mongoose.startSession();
    session.startTransaction()

    try {


        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.CANCELED,
        }, { runValidators: true, session: session })

        await User
            .findByIdAndUpdate(
                updatedPayment?.user,
                { role: ROLE.USER },
                { runValidators: true, session }
            )

        await session.commitTransaction(); //transaction
        session.endSession()
        return { success: false, message: "Payment Failed" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()

        throw error
    }
};
const cancelPayment = async (query: Record<string, string>) => {

    // Update Booking Status to CANCEL
    // Update Payment Status to CANCEL

    const session = await mongoose.startSession();
    session.startTransaction()

    try {


        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.CANCELED,
        }, { runValidators: true, session: session })

        await User
            .findByIdAndUpdate(
                updatedPayment?.user,
                { role: ROLE.USER },
                { runValidators: true, session }
            )

        await session.commitTransaction(); //transaction
        session.endSession()
        return { success: false, message: "Payment Cancelled" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()
        throw error
    }
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment
};