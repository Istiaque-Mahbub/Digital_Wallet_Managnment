import { model, Schema } from "mongoose";
import { IS_ACTIVE, IUser, ROLE } from './user.interface';


const userSchema = new Schema<IUser>({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    payment:{type:Schema.Types.ObjectId,ref:"Payment"},
    password:{type:String,required:true},
    nidNumber:{type:String,required:true,unique:true},
    phone:{type:String,required:true,unique:true},
    role:{
        type:String,
        enum:Object.values(ROLE),
        default:ROLE.USER
    },
    isActive:{
        type:String,
        enum:Object.values(IS_ACTIVE),
        default:IS_ACTIVE.ACTIVE
    },
    adminCommission:{type:Number,default:0},
    isDeleted:{type:Boolean,default:false},
    isVerified:{type:Boolean,default:true},
    wallet:{type:Schema.Types.ObjectId,ref:"Wallet",
    
    }
},{
    timestamps:true,
    versionKey:false
})


export const User = model<IUser>("User",userSchema)