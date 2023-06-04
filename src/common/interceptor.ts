import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { instanceToPlain } from 'class-transformer';

export class SuccessResponse<T> {
  readonly result: string;
  readonly data?: T;

  constructor(data: T) {
    this.result = 'SUCCESS';
    this.data = data;
  }
}

export class CommonResponse<T> {
  readonly result: 'SUCCESS' | 'FAIL';
  data: T;
}

@Injectable()
export class Interceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<unknown>> {
    /* 
      필요하면 로깅 로직을 추가할 수 있다
      console.log({
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
      })
    */

    context.switchToHttp().getResponse().status(HttpStatus.OK);
    return next
      .handle()
      .pipe(map((data) => new SuccessResponse(instanceToPlain(data))));
  }
}
