



import { Schema, model, Types } from "mongoose";
import { ITransaction, TRANSACTION_STATUS } from "./transcation.interface";



const transactionSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",       
      required: true,
    },
    wallet: {
      type: Types.ObjectId,
      ref: "Wallet",     
      required: true,
    },
    amount: {
      type: Number,
      required: true,            
    },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING,
    },
  },
  { timestamps: true,
    versionKey:false
  } 
);

export const Transaction = model<ITransaction>("Transaction",transactionSchema)