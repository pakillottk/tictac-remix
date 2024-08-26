import { inject, injectable } from 'inversify';

import { DomainEventClass } from '@tictac/kernel/src/domain/domain-event';
import { DomainEventSubscriber } from '@tictac/kernel/src/domain/domain-event-subscriber';
import { TicketTypesRepository } from '../../domain/ticket-types-repository';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';
import { CodeScannedEvent } from '@tictac/tictac/src/kernel/domain/events/code-scanned-event';

@injectable()
export class OnCodeScannedIncrementTicketTypeScannedAmmount extends DomainEventSubscriber<CodeScannedEvent> {
  constructor(@inject(TicketTypesRepository) private readonly ticketTypesRepository: TicketTypesRepository) {
    super();
  }

  subscribedTo(): Array<DomainEventClass> {
    return [CodeScannedEvent];
  }

  async on(domainEvent: CodeScannedEvent): Promise<void> {
    const ticketType = await this.ticketTypesRepository.findById(new TicketTypeId(domainEvent.attributes.ticketTypeId));
    if (!ticketType) {
      throw new Error('Ticket type ' + domainEvent.attributes.ticketTypeId + ' not found');
    }

    const updatedTicketType = ticketType.incrementScannedAmmount();
    await this.ticketTypesRepository.save(updatedTicketType);
  }
}
