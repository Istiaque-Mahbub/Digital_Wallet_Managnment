import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError"
import httpStatus  from 'http-status-codes';
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { ROLE } from "../user/user.interface";
import { TRANSACTION_STATUS } from "./transcation.interface";
import { Transaction } from "./transaction.model";


const sendMoney = async(senderId:string,receiverId:string,amount:number)=>{

    if(amount<=0){
        throw new AppError(httpStatus.BAD_REQUEST,"Inappropriate amount")
    }

    amount = amount + 5

    const session = await mongoose.startSession();
    session.startTransaction();

  try {
    
 
    const isSenderUserExist = await User.findById(senderId)
    const isReceiverUserExist = await User.findById(receiverId)

    

    if(!isSenderUserExist ){
        throw new AppError(httpStatus.BAD_REQUEST,"Invalid user")
    }
    if( !isReceiverUserExist ){
        throw new AppError(httpStatus.BAD_REQUEST,"Invalid  receiver")
    }

    const senderWallet = await Wallet.findById(isSenderUserExist?.wallet)
  
    const receiverWallet = await Wallet.findById(isReceiverUserExist.wallet)
    

    if(!senderWallet?.balance){
        throw new AppError(httpStatus.BAD_REQUEST,"You don't have any balance left")
    }


    if(senderWallet?.balance < amount){
        throw new AppError(httpStatus.BAD_REQUEST,"You don't have enough money")
    }

    senderWallet.balance -= amount;
    await senderWallet?.save({ session });
    if (receiverWallet) {
      receiverWallet.balance = receiverWallet.balance! + (amount - 5);
      await receiverWallet?.save({ session });
    }
    

    const superAdmin = await User.findOne({role:ROLE.SUPER_ADMIN})

 

    if (superAdmin) {
        superAdmin.adminCommission! += 5;
        await superAdmin.save({ session });
    }

    const senderTxn = await Transaction.create(
        [
          {
            user: senderId,
            wallet: senderWallet._id,
            amount: -amount,
            status: TRANSACTION_STATUS.COMPLETE,
          },
        ],
        { session }
      );

      const receiverTxn = await Transaction.create(
        [
          {
            user: receiverId,
            wallet: receiverWallet?._id,
            amount: amount-5,
            status: TRANSACTION_STATUS.COMPLETE,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();
  
      return { senderTxn: senderTxn[0], receiverTxn: receiverTxn[0] };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }

}


export const TransactionServices = {
    sendMoney
} 