import { Request } from "express";
import { Response } from "express";

export const getHealthCheck = async (_req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Health Check']
    #swagger.summary = 'Gets a health check from the API (It always returns 200)'
    #swagger.description  = 'Gets a health check from the API (It always returns 200)'
    
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Page" },
      description: 'User data'
    }
  */
  return res
    .status(200)
    .json({ message: "Health Check - API running.", statusCode: 200 });
};
