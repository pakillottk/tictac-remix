import { inject, injectable } from 'inversify';

import { QueryHandler } from '@tictac/kernel/src/domain/query-handler';
import { Query } from '@tictac/kernel/src/domain/query';
import { TictacEventFinder } from '../find/tictac-event-finder';
import {
  EventBasicInfoQuery,
  EventBasicInfoQueryResponse,
} from '@tictac/tictac/src/kernel/domain/queries/event-basic-info-query';

@injectable()
export class EventBasicInfoQueryHandler extends QueryHandler<EventBasicInfoQuery, EventBasicInfoQueryResponse> {
  constructor(@inject(TictacEventFinder) private readonly tictacEventFinder: TictacEventFinder) {
    super();
  }

  subscribedTo(): Query {
    return EventBasicInfoQuery;
  }

  async handle(query: EventBasicInfoQuery): Promise<EventBasicInfoQueryResponse> {
    const event = await this.tictacEventFinder.execute(query.eventId);
    return {
      eventId: event.eventId,
      name: event.name,
      eventDate: event.eventDate,
      scanning: event.scanning,
    };
  }
}
