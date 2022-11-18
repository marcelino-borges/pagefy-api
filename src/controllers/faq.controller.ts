import { Request, Response } from "express";
import { AppErrorsMessages } from "../constants";
import AppResult from "../errors/app-error";
import { IFaq } from "../models/faq.models";
import * as FaqService from "../services/faq.service";
import log from "../utils/logs";

export const createFaq = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['FAQ']
    #swagger.summary = 'Creates a new FAQ'
    #swagger.description  = 'Creates a new FAQ'
    #swagger.parameters['question'] = {
      in: 'body',
      description: 'Question of the FAQ',
      required: true,
      type: 'string'
    }
    #swagger.parameters['answer'] = {
      in: 'body',
      description: 'Answer of the FAQ',
      required: true,
      type: 'string'
    }
    #swagger.parameters['language'] = {
      in: 'body',
      description: 'Language of the FAQ (example: en, pt)',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Created FAQ'
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
  const { question, answer, language } = req.body;

  if (!question || !answer || !language) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.MISSING_PROPS, null, 400));
  }

  try {
    let faqCreated;

    faqCreated = await FaqService.createFaq({ question, answer, language });

    if (!faqCreated) {
      return res
        .status(400)
        .json(new AppResult(AppErrorsMessages.ERROR_CREATE_FAQ, null, 400));
    }
    return res.status(200).json(faqCreated);
  } catch (e: any) {
    log.error("[UserController.getUser] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const updateFaq = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['FAQ']
    #swagger.summary = 'Update FAQ'
    #swagger.description  = 'Update FAQ'
    #swagger.parameters['_id'] = {
      in: 'body',
      description: 'FAQ ID',
      required: false,
      type: 'string'
    }
    #swagger.parameters['question'] = {
      in: 'body',
      description: 'Question of the FAQ',
      required: false,
      type: 'string'
    }
    #swagger.parameters['answer'] = {
      in: 'body',
      description: 'Answer of the FAQ',
      required: false,
      type: 'string'
    }
    #swagger.parameters['language'] = {
      in: 'body',
      description: 'language of the FAQ (example: en, pt)',
      required: false,
      type: 'string'
    }
    #swagger.parameters['userId'] = {
      in: 'body',
      description: 'User ID',
      required: false,
      type: 'string'
    }
    #swagger.parameters['createdAt'] = {
      in: 'body',
      description: 'Date the FAQ was created',
      required: false,
      type: 'string'
    }
    #swagger.parameters['updatedAt'] = {
      in: 'body',
      description: 'Date the FAQ was updated',
      required: false,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'FAQ updated'
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
  const faq: Partial<IFaq> = req.body;

  if (!faq) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.MISSING_PROPS, null, 400));
  }

  try {
    const faqUpdated = await FaqService.updateFaq(faq);

    if (!faqUpdated) {
      return res
        .status(400)
        .json(new AppResult(AppErrorsMessages.ERROR_UPDATE_FAQ, null, 400));
    }
    return res.status(200).json(faqUpdated);
  } catch (e: any) {
    log.error("[UserController.getUser] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const deleteFaq = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['FAQ']
    #swagger.summary = 'Delete FAQ'
    #swagger.description  = 'Delete FAQ'
    #swagger.parameters['id'] = {
      in: 'params',
      description: 'FAQ ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Deleted FAQ'
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
  const faqId: string = req.params.id;

  if (!faqId) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.MISSING_PROPS, null, 400));
  }

  try {
    const faqDeleted = await FaqService.deleteFaq(faqId);

    if (!faqDeleted) {
      return res
        .status(400)
        .json(new AppResult(AppErrorsMessages.ERROR_DELETE_FAQ, null, 400));
    }
    return res.status(200).json(faqDeleted);
  } catch (e: any) {
    log.error("[UserController.getUser] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};

export const getAllFaqs = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['FAQ']
    #swagger.summary = 'Get all FAQs'
    #swagger.description  = 'Get all FAQs'
    #swagger.responses[200] = {
      description: 'Deleted FAQ'
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
  const language = req.query.language ? (req.query.language as string) : "en";

  try {
    const faqsFound = await FaqService.getAllFaqs({ language });

    if (!faqsFound) {
      return res
        .status(400)
        .json(new AppResult(AppErrorsMessages.ERROR_GET_ALL_FAQS, null, 400));
    }
    return res.status(200).json(faqsFound);
  } catch (e: any) {
    log.error("[UserController.getUser] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, e.message, 500));
  }
};
