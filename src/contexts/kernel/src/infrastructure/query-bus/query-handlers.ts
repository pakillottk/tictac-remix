import { Query } from '../../domain/query';
import { QueryHandler } from '../../domain/query-handler';
import { Response } from '../../domain/response';
import { QueryNotRegisteredError } from '../../domain/query-not-registered-rrror';

export class QueryHandlers extends Map<Query, QueryHandler<Query, Response>> {
  constructor(queryHandlers: Array<QueryHandler<Query, Response>>) {
    super();
    queryHandlers.forEach(queryHandler => {
      this.set(queryHandler.subscribedTo(), queryHandler);
    });
  }

  public get(query: Query): QueryHandler<Query, Response> {
    const queryHandler = super.get(query.constructor);

    if (!queryHandler) {
      throw new QueryNotRegisteredError(query);
    }

    return queryHandler;
  }
}
