import { Request, Response } from "express";
import {
  AppErrorsMessages,
  NOREPLY_EMAIL_SENDER,
  SYSTEM_RECIPIENT_EMAIL,
} from "../constants";
import * as emailService from "../services/email.service";
import { IUserContact } from "./../models/email.models";
import AppResult from "../errors/app-error";

export const sendUserContact = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Email']
    #swagger.summary = 'Sends a user email message for system's email'
    #swagger.description  = 'Sends a user email message for system's email'
    #swagger.security = [{
      "bearerAuth": []
    }] 
    #swagger.parameters['name'] = {
      in: 'body',
      description: 'User name',
      required: true,
      type: 'string'
    }
    #swagger.parameters['email'] = {
      in: 'body',
      description: 'User email',
      required: true,
      type: 'string'
    }
    #swagger.parameters['message'] = {
      in: 'body',
      description: 'Message body',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      type: 'string',
      description: 'Message sent'
    }
    #swagger.responses[400] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      schema: { $ref: "#/definitions/Error" },
      description: 'Message of error'
    }
  */
  try {
    const { name, email, message }: IUserContact = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json(
          new AppResult(
            AppErrorsMessages.FIELDS_REQUIRED_EMAIL_CONTACT,
            null,
            400
          )
        );
    }

    return await emailService.sendUserContact(req, res);
  } catch (e) {}
};
