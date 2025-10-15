import { Router } from "express";
import { driverController } from "./driver.controller";


const router = Router();

router.post('/create-driver',driverController.createDriver)
router.post("/accept-ride/:id", driverController.driverAction);
router.patch("/status-update/:id", driverController.updateRideStatus);
router.get("/history/:id", driverController.getDriverHistory);
router.patch("/online-status/:id", driverController.changeOnlineStatus)

export const DriverRoutes = router;