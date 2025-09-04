import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";


const walletSchema =  new Schema<IWallet> ({
    userId:{type:Schema.Types.ObjectId,ref:"User",required:true,unique:true},
    balance:{type:Number,default:10},
    currency:{type:String,default:"BDT"},
    agentMoney:{type:Number,default:0},
    agentCommission:{type:Number,default:0},
},{
    versionKey:false,
    timestamps:true
})

export const Wallet = model<IWallet>("Wallet",walletSchema)
