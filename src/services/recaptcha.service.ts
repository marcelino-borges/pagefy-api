import axios from "axios";
import { API_VERIFY_RECAPTCHA, RECAPTCHA_SECRET_KEY } from "../constants";
import { IRecaptchaResult } from "../models/recaptcha.models";

export const verifyRecaptcha = async (
  token: string
): Promise<IRecaptchaResult> => {
  const api = axios.create({
    baseURL: API_VERIFY_RECAPTCHA,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return await api.post(API_VERIFY_RECAPTCHA, {
    response: token,
    secret: RECAPTCHA_SECRET_KEY,
  });
};
