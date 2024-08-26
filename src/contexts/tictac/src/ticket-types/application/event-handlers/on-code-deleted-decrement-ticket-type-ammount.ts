import { inject, injectable } from 'inversify';

import { DomainEventClass } from '@tictac/kernel/src/domain/domain-event';
import { DomainEventSubscriber } from '@tictac/kernel/src/domain/domain-event-subscriber';
import { CodeDeletedEvent } from '@tictac/tictac/src/kernel/domain/events/code-deleted-event';
import { TicketTypesRepository } from '../../domain/ticket-types-repository';
import { QueryBus } from '@tictac/kernel/src/domain/query-bus';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';
import {
  CodeCountByTicketIdQuery,
  CodeCountByTicketIdQueryResult,
} from '@tictac/tictac/src/kernel/domain/queries/code-count-by-ticket-id-query';

@injectable()
export class OnCodeDeletedDecrementTicketTypeAmmount extends DomainEventSubscriber<CodeDeletedEvent> {
  constructor(
    @inject(QueryBus) private readonly queryBus: QueryBus,
    @inject(TicketTypesRepository) private readonly ticketTypesRepository: TicketTypesRepository
  ) {
    super();
  }

  subscribedTo(): Array<DomainEventClass> {
    return [CodeDeletedEvent];
  }

  async on(domainEvent: CodeDeletedEvent): Promise<void> {
    const ticketType = await this.ticketTypesRepository.findById(new TicketTypeId(domainEvent.attributes.ticketTypeId));
    if (!ticketType) {
      throw new Error('Ticket type ' + domainEvent.attributes.ticketTypeId + ' not found');
    }

    const { count } = await this.queryBus.ask<CodeCountByTicketIdQueryResult>(
      new CodeCountByTicketIdQuery(ticketType.ticketTypeId.value)
    );

    const updatedTicketType = ticketType.setAmmount(count);
    await this.ticketTypesRepository.save(updatedTicketType);
  }
}
