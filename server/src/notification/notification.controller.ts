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

const sendEmail = async (emailPayload: EmailPayload) => {
    const mailOptions = {
        from: "floralyfe",
        ...emailPayload,
    };
    deepLog(mailOptions)
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

const notificationTest = (req, res) => {
    res.status(200).send("Test passed!");
};

const emailTest = (req, res) => {
    const emailPayload = {
        to: "you.ayassin@gmail.com, youyawng303@gmail.com",
        subject: "Your Plant - PlantName - needs your attention!",
        text: "Hey there",
        html: "<b>Hey there</b>",
    };

    try {
        sendEmail(emailPayload);
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
    emailTest,
    sendEmailRouteHandler
} as const;
export default controller;
