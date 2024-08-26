import { injectable } from 'inversify';

import { Query } from './query';
import { Response } from './response';

@injectable()
export abstract class QueryBus {
  abstract ask<R extends Response>(query: Query): Promise<R>;
}
