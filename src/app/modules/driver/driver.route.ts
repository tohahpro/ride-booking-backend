import { Router } from "express";
import { driverController } from "./driver.controller";


const router = Router();

router.post('/create-driver',driverController.createDriver)
router.post("/accept-ride/:id", driverController.driverAction);
router.patch("/status-update/:id", driverController.updateRideStatus);
export const DriverRoutes = router;