import express from "express";
import controller from "./notification.controller";

const router = express.Router();

router.get("/test", controller.notificationTest);
router.get("/emailTest", controller.emailTest);
router.get("/sendEmail", controller.sendEmailRouteHandler);

export default router;