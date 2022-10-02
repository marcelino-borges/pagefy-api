export interface IRecaptchaResult {
  success: boolean;
  challenge_ts: any;
  hostname: string;
  "error-codes": string[];
}
