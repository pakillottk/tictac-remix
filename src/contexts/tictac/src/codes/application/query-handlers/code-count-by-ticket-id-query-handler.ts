import { QueryHandler } from '@tictac/kernel/src/domain/query-handler';
import {
  CodeCountByTicketIdQuery,
  CodeCountByTicketIdQueryResult,
} from '@tictac/tictac/src/kernel/domain/queries/code-count-by-ticket-id-query';
import { inject, injectable } from 'inversify';
import { CodesRepository } from '../../domain/codes-repository';
import { Query } from '@tictac/kernel/src/domain/query';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';

@injectable()
export class CodeCountByTicketIdQueryHandler extends QueryHandler<
  CodeCountByTicketIdQuery,
  CodeCountByTicketIdQueryResult
> {
  constructor(@inject(CodesRepository) private readonly codeRepository: CodesRepository) {
    super();
  }

  subscribedTo(): Query {
    return CodeCountByTicketIdQuery;
  }

  async handle(query: CodeCountByTicketIdQuery): Promise<CodeCountByTicketIdQueryResult> {
    const count = await this.codeRepository.countByTicketTypeId(new TicketTypeId(query.ticketId));
    return { ticketTypeId: query.ticketId, count };
  }
}
