import { Request, Response } from "express";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { NOREPLY_EMAIL_SENDER, SYSTEM_RECIPIENT_EMAIL } from "../constants";
import AppResult from "../errors/app-error";
import { IUserContact } from "./../models/email.models";

export const sendUserContact = async (req: Request, res: Response) => {
  const { name, email, message }: IUserContact = req.body;

  try {
    let transporter = nodemailer.createTransport({
      host: "mail.devbox.eng.br",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: NOREPLY_EMAIL_SENDER.user,
        pass: NOREPLY_EMAIL_SENDER.password,
      },
    });

    transporter
      .sendMail({
        from: `"${name}" <${email}>`, // sender address
        to: SYSTEM_RECIPIENT_EMAIL, // list of receivers
        subject: "Contact from Socialbio.me support page", // Subject line
        replyTo: email,
        text: message, // plain text body
        html: `
        <b>From Socialbio.me support page</b><br>
        <br>
        <b>FROM:</b> ${name}<br>
        <b>EMAIL:</b> ${email}<br>
        <b>MESSAGE:</b><br>
        ${message}
      `,
      })
      .then((info: SMTPTransport.SentMessageInfo) => {
        return res.status(200).json(info);
      });
  } catch (e: any) {
    return res.status(500).json(new AppResult(e.message, e, 500));
  }
};
