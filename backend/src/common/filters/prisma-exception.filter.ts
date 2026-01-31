import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = message;

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        errorMessage = 'Unique constraint violation. Record already exists.';
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        errorMessage = 'Record not found.';
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Foreign key constraint failed.';
        break;
      default:
        errorMessage = 'Database error occurred.';
    }

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
      error: exception.code,
      timestamp: new Date().toISOString(),
    });
  }
}
