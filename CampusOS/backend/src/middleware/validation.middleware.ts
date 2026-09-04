import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './error.middleware';



// Wraps async route handlers so thrown errors reach the error middleware.
// Without this, unhandled promise rejections in async handlers are swallowed.
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler =>
  (req, res, next) => fn(req, res, next).catch(next);



// Validates req.body against a Zod schema before the handler runs.
// Returns 400 with a readable error message if validation fails.
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ');
      return next(new AppError(message, 400));
    }
    req.body = result.data;
    next();
  };
}
