import { Request, Response } from "express";

import AppResult from "@/errors/app-error";
import { ITestimonial } from "@/models/testimonials.models";
import * as TestimonialService from "@/services/testimonials.service";
import { CustomRequest } from "@/types/express-request";
import log from "@/utils/logs";

export const createTestimonial = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Testimonial']
    #swagger.summary = 'Creates a new testimonial'
    #swagger.description  = 'Creates a new testimonial'
    #swagger.parameters['user'] = {
      in: 'body',
      description: 'User ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['testimonial'] = {
      in: 'body',
      description: 'User testimonial',
      required: true,
      type: 'string'
    }
    #swagger.parameters['pictureUrl'] = {
      in: 'body',
      description: 'User picture url',
      required: true,
      type: 'string'
    }
    #swagger.parameters['rating'] = {
      in: 'body',
      description: 'User rating',
      required: true,
      type: 'number'
    }
    #swagger.responses[200] = {
      description: 'User data'
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
  const { user, testimonial, pictureUrl, rating, videoUrl, language } =
    req.body;

  if (!user || !testimonial || !pictureUrl || !rating) {
    return res
      .status(400)
      .json(new AppResult(req.messages.MISSING_PROPS, null, 400));
  }

  try {
    let testimonialCreated;

    if (user && user.length > 0) {
      testimonialCreated = await TestimonialService.createTestimonial({
        user: user,
        testimonial,
        pictureUrl,
        rating,
        videoUrl,
        language,
      });
    }

    if (!testimonialCreated) {
      return res
        .status(400)
        .json(new AppResult(req.messages.ERROR_CREATE_TESTIMONIAL, null, 400));
    }
    return res.status(200).json(testimonialCreated);
  } catch (e: any) {
    log.error("[TestimonialsController.createTestimonial] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(req.messages.INTERNAL_ERROR, e.message, 500));
  }
};

export const getUserTestimonials = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Testimonial']
    #swagger.summary = 'Get all testimonials from an user'
    #swagger.description  = 'Get all testimonials from an user'
    #swagger.parameters['userId'] = {
      in: 'body',
      description: 'User ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'User data'
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
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json(new AppResult(req.messages.MISSING_PROPS, null, 400));
  }

  try {
    const testimonialsFound =
      await TestimonialService.getUserTestimonials(userId);

    if (!testimonialsFound) {
      return res
        .status(400)
        .json(new AppResult(req.messages.ERROR_CREATE_TESTIMONIAL, null, 400));
    }
    return res.status(200).json(testimonialsFound);
  } catch (e: any) {
    log.error("[TestimonialsController.getUserTestimonials] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(req.messages.INTERNAL_ERROR, e.message, 500));
  }
};

export const getUserLastTestimonial = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Testimonial']
    #swagger.summary = 'Get the last testimonial from an user'
    #swagger.description  = 'Get the last testimonial from an user'
    #swagger.parameters['userId'] = {
      in: 'body',
      description: 'User ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'User data'
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
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json(new AppResult(req.messages.MISSING_PROPS, null, 400));
  }

  try {
    const testimonialFound =
      await TestimonialService.getUserLastTestimonial(userId);

    if (!testimonialFound) {
      return res
        .status(400)
        .json(new AppResult(req.messages.ERROR_CREATE_TESTIMONIAL, null, 400));
    }
    return res.status(200).json(testimonialFound);
  } catch (e: any) {
    log.error("[TestimonialsController.getUserLastTestimonial] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(req.messages.INTERNAL_ERROR, e.message, 500));
  }
};

export const queryTestimonials = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Testimonial']
    #swagger.summary = 'Query testimonials'
    #swagger.description  = 'Get testimonials'
    #swagger.parameters['count'] = {
      in: 'query',
      description: 'Count of testimonials to retrieve',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'User data'
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
  const count: number | undefined = req.query.count
    ? Number(req.query.count)
    : 100;
  const language: string | undefined = req.query.language
    ? String(req.query.language)
    : "en";

  try {
    const testimonialFound = await TestimonialService.queryTestimonials({
      count,
      language,
    });

    if (!testimonialFound) {
      return res
        .status(400)
        .json(new AppResult(req.messages.ERROR_GET_ALL_TESTIMONIAL, null, 400));
    }
    return res.status(200).json(testimonialFound);
  } catch (e: any) {
    log.error("[TestimonialsController.queryTestimonials] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(req.messages.INTERNAL_ERROR, e.message, 500));
  }
};

export const updateUserTestimonial = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['testimonialId']
    #swagger.summary = 'Delete a testimonial from an user'
    #swagger.description  = 'Delete a testimonial from an user'
    #swagger.parameters['testimonialId'] = {
      in: 'body',
      description: 'Testimonial ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'User data'
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
  const testimonial: ITestimonial = req.body as ITestimonial;

  if (!testimonial) {
    return res
      .status(400)
      .json(new AppResult(req.messages.MISSING_PROPS, null, 400));
  }

  try {
    const testimonialUpdated =
      await TestimonialService.updateUserTestimonial(testimonial);

    if (!testimonialUpdated) {
      return res
        .status(400)
        .json(new AppResult(req.messages.ERROR_UPDATE_TESTIMONIAL, null, 400));
    }
    return res.status(200).json(testimonialUpdated);
  } catch (e: any) {
    log.error("[TestimonialsController.updateUserTestimonial] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(req.messages.INTERNAL_ERROR, e.message, 500));
  }
};

export const deleteUserTestimonial = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['testimonialId']
    #swagger.summary = 'Delete a testimonial from an user'
    #swagger.description  = 'Delete a testimonial from an user'
    #swagger.parameters['testimonialId'] = {
      in: 'body',
      description: 'Testimonial ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'User data'
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
  const testimonialId: string = req.params.testimonialId;

  if (!testimonialId) {
    return res
      .status(400)
      .json(new AppResult(req.messages.MISSING_PROPS, null, 400));
  }

  try {
    const testimonialDeleted =
      await TestimonialService.deleteUserTestimonial(testimonialId);

    if (!testimonialDeleted) {
      return res
        .status(400)
        .json(new AppResult(req.messages.ERROR_DELETE_TESTIMONIAL, null, 400));
    }
    return res.status(200).json(testimonialDeleted);
  } catch (e: any) {
    log.error("[TestimonialsController.deleteUserTestimonial] EXCEPTION: ", e);
    return res
      .status(500)
      .json(new AppResult(req.messages.INTERNAL_ERROR, e.message, 500));
  }
};
