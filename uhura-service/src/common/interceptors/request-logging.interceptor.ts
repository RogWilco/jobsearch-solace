import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger = new Logger(RequestLoggingInterceptor.name),
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    this.logger.debug(
      'Request: ' +
        context.switchToHttp().getRequest().method +
        ' => ' +
        context.switchToHttp().getRequest().path +
        ' started',
    )

    const now = Date.now()

    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.log(
            'Request: ' +
              context.switchToHttp().getRequest().method +
              ' => ' +
              context.switchToHttp().getRequest().path +
              ` success... ${Date.now() - now}ms`,
          ),
        error: (err) => {
          this.logger.error(
            'Request: ' +
              context.switchToHttp().getRequest().method +
              ' => ' +
              context.switchToHttp().getRequest().path +
              ` failed... ${Date.now() - now}ms`,
          )
          throwError(() => err)
        },
      }),
    )
  }
}
