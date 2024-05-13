import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Primitive } from '../utility.types'

/**
 * This interceptor adds global headers to all responses.
 */
@Injectable()
export class GlobalHeadersInterceptor implements NestInterceptor {
  /**
   * Initializes a new global header interceptor with the specified headers.
   *
   * @param headers The headers to add to the response.
   */
  constructor(private readonly headers: Record<string, Primitive>) {}

  /**
   * Adds all configured global headers to the current response.
   *
   * @param context The current execution context.
   * @param next The next handler in the chain.
   *
   * @returns The response observable.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse()

    for (const name in this.headers) {
      response.setHeader(name, this.headers[name])
    }

    return next.handle().pipe()
  }
}
