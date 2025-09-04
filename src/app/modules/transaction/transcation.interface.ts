import { Types } from "mongoose";


export enum TRANSACTION_STATUS{
    PENDING = "PENDING",
    COMPLETE = "COMPLETE",
    FAILED = "FAILED"
}

export interface ITransaction{

    user:Types.ObjectId,
    Wallet:Types.ObjectId,
    amount: number; 
    status: TRANSACTION_STATUS
}