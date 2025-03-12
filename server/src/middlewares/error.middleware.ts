import { NextFunction, Request, Response } from "express";

export class CustomError extends Error {
  status: number;

  constructor(message?: string, status?: number) {
    super(message);
    this.status = status || 500;
    Object.setPrototypeOf(this, CustomError.prototype); // Fix prototype chain
  }
}

const handleError = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  res.status(err?.status || 500).send({
    status: err?.status || 500,
    message: err.message || "Something has gone wrong!"
  });
}

export default handleError;
