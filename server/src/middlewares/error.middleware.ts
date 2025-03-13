import { NextFunction, Request, Response } from "express";

export class CustomError extends Error {
  status: number;
  errors?: any;

  constructor(message?: string, status?: number) {
    super(message);
    this.status = status || 500;
    Object.setPrototypeOf(this, CustomError.prototype); // Fix prototype chain
  }
}

const handleError = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  const response:any = {
    status: err?.status || 500,
    message: err.message || "Something has gone wrong!"
  };
  if(err.errors){
    response.errors = err.errors;
  }
  res.status(err?.status || 500).send(response);
}

export default handleError;
