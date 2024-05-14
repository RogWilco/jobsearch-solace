import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { EntityNotFoundError, QueryFailedError } from 'typeorm'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    switch (true) {
      case exception instanceof HttpException: {
        const status = exception.getStatus()
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        })
        break
      }
      case exception instanceof EntityNotFoundError: {
        response.status(404).json({
          statusCode: 404,
          message: 'Entity not found',
          timestamp: new Date().toISOString(),
          path: request.url,
        })
        break
      }
      case exception instanceof QueryFailedError: {
        response.status(400).json({
          exception: exception.name,

          statusCode: 400,
          message: 'Query failed',
          timestamp: new Date().toISOString(),
          path: request.url,
        })
        break
      }
      default: {
        response.status(500).json({
          statusCode: 500,
          message: 'Internal server error',
          timestamp: new Date().toISOString(),
          path: request.url,
        })
      }
    }
  }
}
