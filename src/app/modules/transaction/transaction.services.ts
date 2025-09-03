import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError"
import httpStatus  from 'http-status-codes';
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { ROLE } from "../user/user.interface";
import { TRANSACTION_STATUS } from "./transcation.interface";
import { Transaction } from "./transaction.model";


const agentCommission=2
const superAdminCommission=5

const sendMoney = async(senderId:string,receiverId:string,amount:number)=>{

    if(amount<=0){
        throw new AppError(httpStatus.BAD_REQUEST,"Inappropriate amount")
    }

    amount = amount + superAdminCommission

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
      receiverWallet.balance = receiverWallet.balance! + (amount - superAdminCommission);
      await receiverWallet?.save({ session });
    }
    

    const superAdmin = await User.findOne({role:ROLE.SUPER_ADMIN})

 

    if (superAdmin) {
        superAdmin.adminCommission! += superAdminCommission;
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
            amount: amount-superAdminCommission,
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


const cashIn =async (agentId:string,receiverId:string,amount:number) =>{
  
  if(amount<=0){
    throw new AppError(httpStatus.BAD_REQUEST,"Inappropriate amount")
}

amount = amount + agentCommission

const session = await mongoose.startSession();
session.startTransaction();

try {
  
  const agent = await User.findById(agentId)
  const receiver = await User.findById(receiverId)
  

  if(!agent){
    throw new AppError(httpStatus.BAD_REQUEST,"Agent doesn't exists")
  }
  if(!receiver){
    throw new AppError(httpStatus.BAD_REQUEST,"Receiver doesn't exists")
  }

  if(agent.role!==ROLE.AGENT){
    throw new AppError(httpStatus.FORBIDDEN,"You are not and agent")
  }

  const agentWallet = await Wallet.findById(agent.wallet)
  const receiverWallet = await Wallet.findById(receiver.wallet)

  if (!receiverWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Receiver wallet does not exist");
  }
  if (!agentWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent wallet does not exist");
  }

  if(!agentWallet.agentMoney){
    throw new AppError(httpStatus.BAD_REQUEST, "Agent doesn't have any money"); 
  }

  if(agentWallet.agentMoney<amount){
    throw new AppError(httpStatus.BAD_REQUEST, "Agent wallet does not have enough");
  }

  receiverWallet.balance = receiverWallet.balance! + (amount - agentCommission);
  await receiverWallet.save({ session });
  agentWallet.balance! -=amount;
  agentWallet.agentCommission! += agentCommission 
  agentWallet.agentMoney -= amount
  await agentWallet.save({ session });

  
  const agentTxn = await Transaction.create(
    [
      {
        user: agentId,
        wallet: agentWallet._id,
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
        amount: amount-agentCommission,
        status: TRANSACTION_STATUS.COMPLETE,
      },
    ],
    { session }
  );

  await session.commitTransaction();
      session.endSession();
  return{agentTxn: agentTxn[0], receiverTxn: receiverTxn[0]}

} catch (error) {
  await session.abortTransaction()
  session.endSession()
  throw error
}

}


export const TransactionServices = {
    sendMoney,cashIn
} 