import { Request, Response, NextFunction } from 'express';
import { AgentService, MessageInput } from '../agent/agent.service';
import { AppError } from '../middleware/error.middleware';

export class AgentController {
  static async chat(req: Request, res: Response, next: NextFunction) {
    try {
      let messages: MessageInput[] = [];

      if (Array.isArray(req.body.messages) && req.body.messages.length > 0) {
        messages = req.body.messages;
      } else if (typeof req.body.message === 'string' && req.body.message.trim().length > 0) {
        messages = [{ role: 'user', content: req.body.message.trim() }];
      } else {
        throw new AppError('Request must include either "messages" array or "message" string', 400);
      }

      const result = await AgentService.chat(messages);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
