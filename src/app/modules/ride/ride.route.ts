


import { Router } from "express";
import { RideController } from "./ride.controller";


const router = Router();

router.post('/request-ride', RideController.createRideRequest)


export const RideRoutes = router