export class CommonException extends Error {
  context: string;
  type: string;

  constructor(context: string, type: string, message?: string) {
    super(message);
    this.name = 'MY_SERVICE_EXCEPTION';
    this.context = context;
    this.type = type;
  }
}
