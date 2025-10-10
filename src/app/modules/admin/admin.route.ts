import { Router } from "express";
import { adminController } from "./admin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";

const router = Router();

router.get("/getAllUser", checkAuth(UserRole.ADMIN), adminController.getAllUser);
router.get("/getAllRide", checkAuth(UserRole.ADMIN), adminController.getAllRide);
router.patch("/changeIsApproveStatus/:id", checkAuth(UserRole.ADMIN), adminController.changeIsApproveStatus);
router.patch("/updateActiveStatus/:id", checkAuth(UserRole.ADMIN), adminController.updateActiveStatus);
router.patch("/changeBlockStatus/:id", checkAuth(UserRole.ADMIN), adminController.changeBlockStatus);



export const AdminRoutes = router;