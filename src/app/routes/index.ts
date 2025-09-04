import { Router } from "express"
import { UserRoutes } from "../modules/user/users.routes"
import { AuthRoutes } from "../modules/auth/auth.routes"
import { TransactionRouters } from "../modules/transaction/transaction.routes"
import { PaymentRoutes } from "../modules/payment/payment.routes"

export const router = Router()

const moduleRoutes = [
    {
        path:"/user",
        route:UserRoutes
    },
    {
        path:"/auth",
        route:AuthRoutes
    },
    {
        path:"/payment",
        route:PaymentRoutes
    },
    {
        path:"/transaction",
        route:TransactionRouters
    },
]

moduleRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})