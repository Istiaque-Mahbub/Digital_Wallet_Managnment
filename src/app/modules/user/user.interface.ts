import { Types } from "mongoose"


export enum ROLE {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT"
} 

export enum IS_ACTIVE{
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED'
}

export interface IUser{
    name:string
    email:string
    nidNumber:string
    photo?:string
    password:string
    phone:string
    address?:string
    isDeleted?:boolean
    isActive?:IS_ACTIVE
    isVerified?:boolean
    role?: ROLE
    wallet?: Types.ObjectId
   
    
}