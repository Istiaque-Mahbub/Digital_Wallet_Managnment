import { Types } from "mongoose";

export enum PAYMENT_STATUS{
    PAID = "PAID",
    UNPAID = "UNPAID",
    CANCELED ="CANCELED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}

export interface IPayment{
    user : Types.ObjectId
    wallet : Types.ObjectId
    transactionId : string
    amount : number
    paymentGateWayData ? : any
    invoiceUrl ?: string
    status : PAYMENT_STATUS
}