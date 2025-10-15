import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "./user.interface";


const router = Router();

router.post('/register',UserController.createUser)
router.get("/me",checkAuth(...Object.values(UserRole)), UserController.getMe);
router.patch('/:id',checkAuth(...Object.values(UserRole)), UserController.updateUser)

export const UserRoutes = router