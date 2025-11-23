import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      tuid?: string;
      acc_Tk?: string | null;
      ref_TK?: string | null;
      errorMsg?: string;
      clientIp?: string;
    }
  }
}

export {};

