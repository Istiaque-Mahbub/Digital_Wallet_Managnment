import { envVars } from "../config/env"
import { IUser, ROLE } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
import bcryptjs from "bcryptjs"

export const seedSuperAdmin = async ()=> {
 try {
    const isSuperAdminExists = await User.findOne({email:envVars.SUPER_ADMIN_EMAIL})
    if(isSuperAdminExists){
        console.log("Super admin already exist")
        return
    }

    const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD,Number(envVars.BCRYPT_SALT_ROUND))

    const payload:Partial<IUser>={
        name:"Super Admin",
        role:ROLE.SUPER_ADMIN,
        email:envVars.SUPER_ADMIN_EMAIL,
        password:hashedPassword,
        isVerified:true,
        phone:"01210000070",
        nidNumber:"1234567894123"
    }
    const superAdmin = await User.create(payload)
    console.log("Super Admin created")

 } catch (error) {
    console.log(error)
 }   
}