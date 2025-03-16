import swaggerAutogen from "swagger-autogen";

import { getPackageJson } from "../config/package-json";
import {
  componentModel,
  errorModel,
  fileUploadFormDataModel,
  onboardingFlagsModel,
  pageModel,
  styleModel,
  userModel,
  userTestimonialModel,
} from "./models";

export const runSwaggerAutogen = async (apiVersion: string) => {
  const SWAGGER_OUTPUT_PATH = "./swagger_output.json";
  const ROUTES_PATH = ["./src/routes/index.ts"];
  const apiDescription = (await getPackageJson()).description;

  const doc = {
    info: {
      version: apiVersion,
      title: apiDescription.description,
    },
    host: "http://pagefy-api.onrender.com",
    basePath: "/",
    consumes: ["application/json"],
    definitions: {
      User: userModel,
      Page: pageModel,
      Error: errorModel,
      ImageUploadFormData: fileUploadFormDataModel,
      Style: styleModel,
      Component: componentModel,
      Testimonial: userTestimonialModel,
      OnboardingsFlags: onboardingFlagsModel,
    },
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        bearerFormat: "JWT",
        in: "header",
        name: "Authorization",
        description: "Provide a JWT bearer token",
        value: "Bearer XXXXXXXXXXXXXXXXXX",
      },
    },
  };

  swaggerAutogen()(SWAGGER_OUTPUT_PATH, ROUTES_PATH, doc);
};
