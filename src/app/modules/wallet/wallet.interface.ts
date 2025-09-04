import { Types } from "mongoose";


export interface IWallet {               
    userId: Types.ObjectId;            
    balance?: number;           
    currency?: string;
    agentMoney?:number;                
    agentCommission?:number;                
  }