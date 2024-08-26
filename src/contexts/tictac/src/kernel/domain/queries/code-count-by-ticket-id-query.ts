import { Query } from '@tictac/kernel/src/domain/query';

export class CodeCountByTicketIdQuery extends Query {
  constructor(public readonly ticketId: string) {
    super();
  }
}

export interface CodeCountByTicketIdQueryResult {
  ticketTypeId: string;
  count: number;
}
