import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";


const walletSchema =  new Schema<IWallet> ({
    userId:{type:Schema.Types.ObjectId,ref:"User",required:true,unique:true},
    balance:{type:Number,default:0},
    currency:{type:String,default:"BDT"}
},{
    versionKey:false,
    timestamps:true
})

export const Wallet = model<IWallet>("Wallet",walletSchema)
