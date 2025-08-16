import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";


const router = Router()

router.post('/login', AuthControllers.credentialsLogin)
router.post('/logout', AuthControllers.logout)
router.post('/change-password', checkAuth(...Object.values(UserRole)), AuthControllers.changePassword)

export const AuthRoutes = router;