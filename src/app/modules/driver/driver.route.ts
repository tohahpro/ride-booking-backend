import { Router } from "express";
import { driverController } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";


const router = Router();

router.post('/create-driver',driverController.createDriver)
router.post("/accept-ride/:id",checkAuth(UserRole.DRIVER), driverController.driverAction);
router.patch("/status-update/:id",checkAuth(UserRole.DRIVER, UserRole.ADMIN), driverController.updateRideStatus);
router.get("/history",checkAuth(UserRole.DRIVER), driverController.getDriverHistory);
router.patch("/online-status",checkAuth(UserRole.DRIVER, UserRole.ADMIN), driverController.changeOnlineStatus)

export const DriverRoutes = router;