import z from "zod";
import { IS_ACTIVE, ROLE } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: z
        .string()
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
        nidNumber:z.string({message:"Must be fill the nid number"})
        .regex(/^(?:\d{10}|\d{13}|\d{17})$/,{
            message:"Give a valid nid number"
        }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }),
    phone: z
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        }),
    address: z
        .string()
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional()
})
export const updateUserZodSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }).optional(),
    role: z
        .enum(Object.values(ROLE) as [string, ...string[]])
        .optional(),
    isActive: z
        .enum(Object.values(IS_ACTIVE) as [string, ...string[]])
        .optional(),
    isDeleted: z
        .boolean()
        .optional(),
    isVerified: z
        .boolean({ message: "isVerified must be true or false" })
        .optional(),
    address: z
        .string()
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional()
})