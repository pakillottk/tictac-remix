import { Query } from '@tictac/kernel/src/domain/query';

export class EventBasicInfoQuery extends Query {
  constructor(public readonly eventId: string) {
    super();
  }
}

export interface EventBasicInfoQueryResponse {
  eventId: string;
  name: string;
  eventDate: Date;
  scanning: boolean;
}
