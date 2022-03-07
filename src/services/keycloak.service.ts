import axios, { AxiosError, AxiosResponse } from "axios";
import { AppErrorsMessages } from "../constants";
import { IKeycloakUserInfo } from "../models/keycloak.models";
import AppResult from "./../errors/app-error";

export const isTokenValid = (token: string) => {
  const endpoint = process.env.KEYCLOAK_AUTH_SERVER_URL;
  const realm = process.env.KEYCLOAK_REALM;

  if (!endpoint || !realm) {
    return new AppResult(
      AppErrorsMessages.INTERNAL_ERROR,
      AppErrorsMessages.TOKEN_VERIFIER_MIDDLEWARE,
      500
    );
  }

  const keycloakApi = axios.create({
    baseURL: `${endpoint}/realms/${realm}/protocol/openid-connect/userinfo`,
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return keycloakApi
    .get("/")
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        const userUInfo: IKeycloakUserInfo = response.data;
        return userUInfo;
      }
      return new AppResult(AppErrorsMessages.INVALID_TOKEN, null, 401);
    })
    .catch((e: AxiosError) => {
      return new AppResult(AppErrorsMessages.INVALID_TOKEN, e.message, 401);
    });
};
