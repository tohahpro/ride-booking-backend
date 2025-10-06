import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/getAllUser", adminController.getAllUser);

export const AdminRoutes = router;