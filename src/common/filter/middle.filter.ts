import {
  ExceptionFilter,
  ArgumentsHost,
  Catch,
  HttpStatus,
} from '@nestjs/common';

export interface ErrorInfo {
  code: string;
  desc?: string;
}

export class FailResponse {
  readonly result: string;
  readonly error: ErrorInfo;

  constructor(error: ErrorInfo) {
    this.result = 'FAIL';
    this.error = error;
  }
}

@Catch()
export class MiddleExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const failRes: FailResponse = new FailResponse({
      code: `${error.context as string}__${error.type as string}`,
      desc: error.message,
    });

    host.switchToHttp().getResponse().status(HttpStatus.OK).json(failRes);
  }
}
