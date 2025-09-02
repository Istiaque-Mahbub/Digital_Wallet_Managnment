import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewire/checkAuth";
import { ROLE } from "../user/user.interface";


const router = Router()

router.post('/login',AuthControllers.credentialLogin)
router.post('/refresh-token',AuthControllers.getNewAccessToken)
router.post('/logout',AuthControllers.logout)
router.post("/reset-password",checkAuth(...Object.values(ROLE)),AuthControllers.resetPassword)

export const AuthRoutes = router