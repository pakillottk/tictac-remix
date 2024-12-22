import 'reflect-metadata';
import { injectable } from 'inversify';
import { Request } from './request';
import { Response } from './response';

@injectable()
export abstract class ControllerBase<TBody = never> {
  public async handle(req: Request): Promise<Response<TBody | Error>> {
    try {
      return await this._handle(req);
    } catch (error) {
      return {
        status: 500,
        body: error instanceof Error ? error : new Error('Internal server error'),
      };
    }
  }
  protected abstract _handle(req: Request): Promise<Response<TBody | Error>>;
}
