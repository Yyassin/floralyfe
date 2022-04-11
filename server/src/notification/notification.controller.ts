/**
 * notification.controller.ts
 * 
 * Notification controller route endpoint
 * logic for sending emails with nodemailer.
 * @author Yousef 
 */

// Load env variables.
require("dotenv").config();

import nodemailer from "nodemailer";
import { debug, deepLog, delay, logError } from "../util";

interface EmailPayload {
    to: String;
    subject: String;
    text: String;
    html: String;
}

// Email transporter config
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

/**
 * Route helper that processes and sends
 * the specified email payload.
 * @param emailPayload EmailPayload, the email to send.
 */
const sendEmail = async (emailPayload: EmailPayload) => {
    // Add the from address.
    const mailOptions = {
        from: "floralyfe",
        ...emailPayload,
    };

    //deepLog(mailOptions)

    // Send the email
    await transporter.sendMail(mailOptions, (error, info) => {
        console.log("Sent")
        if (error) {
            logError(error);
        } else {
            debug("Email sent: " + info.response);
            debug(info.messageId);
        }
    });
};

/**
 * Test endpoint for jest.
 * @param req, the request.
 * @param res, the response.
 */
const notificationTest = (req, res) => {
    res.status(200).send("Test passed!");
};

/**
 * Send email wrapper to process request.
 * @param req, the request - contains the email payload.
 * @param res, the response.
 */
const sendEmailRouteHandler = (req, res) => {
    deepLog(req.body)
    const { email } = req.body;
    try {
        sendEmail(email);
        res.status(200).send("Sent Email!");
    } catch (error) {
        res.status(500).send({
            error: {
                message: "Error sending email",
                error,
            },
        });
    }
};

const controller = {
    notificationTest,
    sendEmailRouteHandler
} as const;

export default controller;
