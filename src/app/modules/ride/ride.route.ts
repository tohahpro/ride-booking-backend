


import { Router } from "express";
import { RideController } from "./ride.controller";


const router = Router();

router.post('/request-ride', RideController.createRideRequest)
router.get('/request-ride', RideController.getAllRideRequests)
router.get('/history/:id', RideController.getRiderHistory)
router.patch('/request-ride/:id', RideController.cancelRideRequest)

export const RideRoutes = router