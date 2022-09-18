import * as express from "express";
import * as healthCheckController from "../controllers/health-monitor.controller";

const router = express.Router();

/*
 * HEALTH CHECK
 */

// Public routes
router.get("/", healthCheckController.getHealthCheck);

export default router;
