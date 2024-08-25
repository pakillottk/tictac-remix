import { Query } from '../../domain/query';
import { Response } from '../../domain/response';
import { QueryBus } from '../../domain/query-bus';
import { QueryHandlers } from './query-handlers';

export class InMemoryQueryBus implements QueryBus {
  constructor(private queryHandlersInformation: QueryHandlers) {}

  async ask<R extends Response>(query: Query): Promise<R> {
    const handler = this.queryHandlersInformation.get(query);

    return (await handler.handle(query)) as Promise<R>;
  }
}
