import { Request, Response } from "express";

export const getApi = async (req: Request, res: Response) => {
  return res.status(200).end();
};
