import { Router } from "express";
import { checkAuth } from "../../middlewire/checkAuth";
import { ROLE } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";



const router = Router()

router.post("/send-money",checkAuth(...Object.values(ROLE)),TransactionController.sendMoney)
router.post("/cash-in",checkAuth(ROLE.AGENT),TransactionController.cashIn)
router.post("/cash-out",checkAuth(ROLE.AGENT),TransactionController.cashOut)
router.get("/all-transaction",checkAuth(ROLE.ADMIN,ROLE.SUPER_ADMIN),TransactionController.getAllTransaction)
router.get("/individual-transaction/:id",checkAuth(...Object.values(ROLE)),TransactionController.getIndividualTransactionHistory)


export const TransactionRouters = router