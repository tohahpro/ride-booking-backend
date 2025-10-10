import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/getAllUser", adminController.getAllUser);
router.get("/getAllRide", adminController.getAllRide);
router.patch("/changeIsApproveStatus/:id",adminController.changeIsApproveStatus);
router.patch("/updateActiveStatus/:id", adminController.updateActiveStatus);
router.patch("/changeBlockStatus/:id",adminController.changeBlockStatus);



export const AdminRoutes = router;