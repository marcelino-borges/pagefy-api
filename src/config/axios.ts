import axios from "axios";

export const paymentsApi = axios.create({
  baseURL: `${process.env.PAYMENTS_API}`,
});
