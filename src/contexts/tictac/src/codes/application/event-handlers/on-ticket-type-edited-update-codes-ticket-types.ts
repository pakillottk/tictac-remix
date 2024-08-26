import { inject, injectable } from 'inversify';

import { DomainEventSubscriber } from '@tictac/kernel/src/domain/domain-event-subscriber';
import { TicketTypeEditedEvent } from '@tictac/tictac/src/kernel/domain/events/ticket-type-edited-event';
import { DomainEventClass } from '@tictac/kernel/src/domain/domain-event';
import { CodesRepository } from '../../domain/codes-repository';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';
import { CodeTicketType } from '../../domain/code-ticket-type';

@injectable()
export class OnTicketTypeEditedUpdateCodesTicketTypes extends DomainEventSubscriber<TicketTypeEditedEvent> {
  constructor(@inject(CodesRepository) private readonly codesTicketTypesRepository: CodesRepository) {
    super();
  }

  subscribedTo(): Array<DomainEventClass> {
    return [TicketTypeEditedEvent];
  }

  async on(domainEvent: TicketTypeEditedEvent): Promise<void> {
    if (domainEvent.attributes.newValues.name === domainEvent.attributes.oldValues.name) {
      return;
    }

    const boundCodes = await this.codesTicketTypesRepository.findByTicketTypeId(
      new TicketTypeId(domainEvent.attributes.ticketTypeId)
    );

    const newTicketType = CodeTicketType.fromPrimitives({
      id: domainEvent.attributes.ticketTypeId,
      name: domainEvent.attributes.newValues.name,
    });

    const editedCodes = boundCodes.map((code) => code.updateTicketType(newTicketType));

    await this.codesTicketTypesRepository.bulkUpdate(editedCodes);
  }
}
