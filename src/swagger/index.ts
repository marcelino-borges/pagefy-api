import { getPackageJson } from "../config/package-json";
import {
  userModel,
  pageModel,
  errorModel,
  fileUploadFormDataModel,
  styleModel,
  componentModel,
} from "./models";

import swaggerAutogen from "swagger-autogen";

export const runSwaggerAutogen = async (apiVersion: string) => {
  const SWAGGER_OUTPUT_PATH = "./swagger_output.json";
  const ROUTES_PATH = ["./src/routes/index.ts"];
  const apiDescription = (await getPackageJson()).description;

  const doc = {
    info: {
      version: apiVersion,
      title: apiDescription.description,
    },
    host: "http://socialbio-api.onrender.com",
    basePath: "/",
    consumes: ["application/json"],
    definitions: {
      User: userModel,
      Page: pageModel,
      Error: errorModel,
      ImageUploadFormData: fileUploadFormDataModel,
      Style: styleModel,
      Component: componentModel,
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
