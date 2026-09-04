import { AuthPayload } from './student.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
