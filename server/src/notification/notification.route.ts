/**
 * notification.route.ts
 * 
 * Defines email notification routes.
 * @author Yousef 
 */

import express from "express";
import controller from "./notification.controller";

const router = express.Router();

// Email routes
router.get("/test", controller.notificationTest);
router.post("/sendEmail", controller.sendEmailRouteHandler);

export default router;