import axios from "axios";
import qs from "qs";

import { API_VERIFY_RECAPTCHA, RECAPTCHA_SECRET_KEY } from "@/constants";
import { IRecaptchaResult } from "@/models/recaptcha.models";

export const verifyRecaptcha = async (
  token: string,
): Promise<IRecaptchaResult> => {
  var data = qs.stringify({
    secret: RECAPTCHA_SECRET_KEY,
    response: token,
  });

  const response = await axios.post(API_VERIFY_RECAPTCHA, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};
