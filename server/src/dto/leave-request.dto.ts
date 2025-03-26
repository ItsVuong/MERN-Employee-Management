import { Request } from "express-validator/lib/base";

export interface CreateLeaveReqDto extends Request{
  date: Date,
  reason: string
}
