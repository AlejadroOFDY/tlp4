import type { ErrorRequestHandler } from 'express';
import { AppError } from './AppError.js';

export class ErrorHandler {
  public handle: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);

    return res.status(500).json({ message: 'Error interno del servidor' });
  };
}
