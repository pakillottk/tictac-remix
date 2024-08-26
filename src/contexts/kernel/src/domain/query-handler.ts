import { injectable } from 'inversify';

import { Query } from './query';
import { Response } from './response';

@injectable()
export abstract class QueryHandler<Q extends Query, R extends Response> {
  abstract subscribedTo(): Query;
  abstract handle(query: Q): Promise<R>;
}
