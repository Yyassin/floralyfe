// Load env variables.
require("dotenv").config();

import nodemailer from "nodemailer";
import { debug, delay, logError } from "../util";

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

const sendEmail = (emailPayload: EmailPayload) => {
    const mailOptions = {
        from: "floralyfe",
        ...emailPayload,
    };

    transporter.sendMail(mailOptions, (error, info) => {
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
        to: "AbdallaAbdelhadi@cmail.carleton.ca, ZakariyyaAlmalki@cmail.carleton.ca, IbrahimAlmalki@cmail.carleton.ca, youyawng303@gmail.com",
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
    const { email } = req;
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
