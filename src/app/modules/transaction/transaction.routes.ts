import { Router } from "express";
import { checkAuth } from "../../middlewire/checkAuth";
import { ROLE } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";



const router = Router()

router.post("/send-money",checkAuth(...Object.values(ROLE)),TransactionController.sendMoney)
router.post("/cash-in",checkAuth(ROLE.AGENT),TransactionController.cashIn)


export const TransactionRouters = router