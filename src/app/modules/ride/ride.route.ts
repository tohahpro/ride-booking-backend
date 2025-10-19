import { Router } from "express";
import { RideController } from "./ride.controller";

const router = Router();

router.post('/request-ride/:id', RideController.createRideRequest)
router.get('/request-ride', RideController.getAllRideRequests)
router.get('/history/:id', RideController.getRiderHistory)
router.patch('/request-ride/:id', RideController.cancelRideRequest)
router.patch('/feedback/:id', RideController.setDriverFeedback)


export const RideRoutes = router