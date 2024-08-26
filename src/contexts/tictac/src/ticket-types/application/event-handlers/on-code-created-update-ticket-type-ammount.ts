import { inject, injectable } from 'inversify';

import { DomainEventSubscriber } from '@tictac/kernel/src/domain/domain-event-subscriber';
import { CodeCreatedEvent } from '@tictac/tictac/src/kernel/domain/events/code-created-event';
import { TicketTypesRepository } from '../../domain/ticket-types-repository';
import { DomainEventClass } from '@tictac/kernel/src/domain/domain-event';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';

@injectable()
export class OnCodeCreatedUpdateTicketTypeAmmount extends DomainEventSubscriber<CodeCreatedEvent> {
  constructor(@inject(TicketTypesRepository) private readonly ticketTypesRepository: TicketTypesRepository) {
    super();
  }

  subscribedTo(): Array<DomainEventClass> {
    return [CodeCreatedEvent];
  }

  async on(domainEvent: CodeCreatedEvent): Promise<void> {
    const ticketType = await this.ticketTypesRepository.findById(new TicketTypeId(domainEvent.attributes.ticketTypeId));
    if (!ticketType) {
      throw new Error(`Ticket type with ID ${domainEvent.attributes.ticketTypeId} not found`);
    }

    const updatedTicketType = ticketType.incrementAmmount();

    await this.ticketTypesRepository.save(updatedTicketType);
  }
}
