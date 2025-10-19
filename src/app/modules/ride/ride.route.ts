import { Router } from "express";
import { RideController } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";

const router = Router();

router.post('/request-ride/:id', checkAuth(UserRole.RIDER), RideController.createRideRequest)
router.get('/request-ride', checkAuth(UserRole.DRIVER, UserRole.ADMIN), RideController.getAllRideRequests)
router.get('/history/:id', checkAuth(UserRole.RIDER), RideController.getRiderHistory)
router.patch('/request-ride/:id', checkAuth(UserRole.RIDER, UserRole.ADMIN), RideController.cancelRideRequest)
router.patch('/feedback/:id', checkAuth(UserRole.RIDER), RideController.setDriverFeedback)


export const RideRoutes = router