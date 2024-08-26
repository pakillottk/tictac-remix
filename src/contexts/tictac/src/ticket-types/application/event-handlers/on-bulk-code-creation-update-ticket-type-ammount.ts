import { inject, injectable } from 'inversify';

import { DomainEventSubscriber } from '@tictac/kernel/src/domain/domain-event-subscriber';
import { TicketTypesRepository } from '../../domain/ticket-types-repository';
import { DomainEventClass } from '@tictac/kernel/src/domain/domain-event';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';
import { CodeBulkCreationEvent } from '@tictac/tictac/src/kernel/domain/events/code-bulk-creation-event';
import { QueryBus } from '@tictac/kernel/src/domain/query-bus';
import {
  CodeCountByTicketIdQuery,
  CodeCountByTicketIdQueryResult,
} from '@tictac/tictac/src/kernel/domain/queries/code-count-by-ticket-id-query';

@injectable()
export class OnBulkCodeCreationUpdateTicketTypeAmmount extends DomainEventSubscriber<CodeBulkCreationEvent> {
  constructor(
    @inject(QueryBus) private readonly queryBus: QueryBus,
    @inject(TicketTypesRepository) private readonly ticketTypesRepository: TicketTypesRepository
  ) {
    super();
  }

  subscribedTo(): Array<DomainEventClass> {
    return [CodeBulkCreationEvent];
  }

  async on(domainEvent: CodeBulkCreationEvent): Promise<void> {
    for (const ticketTypeId of domainEvent.attributes.ticketTypeIds) {
      const ticketType = await this.ticketTypesRepository.findById(new TicketTypeId(ticketTypeId));
      if (!ticketType) {
        throw new Error(`Ticket type with ID ${ticketTypeId} not found`);
      }

      const { count } = await this.queryBus.ask<CodeCountByTicketIdQueryResult>(
        new CodeCountByTicketIdQuery(ticketTypeId)
      );
      const updatedTicketType = ticketType.setAmmount(count);
      await this.ticketTypesRepository.save(updatedTicketType);
    }
  }
}
