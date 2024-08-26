import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { inject, injectable } from 'inversify';
import { TicketTypesRepository } from '../../domain/ticket-types-repository';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';

export interface TicketTypeEditorParamaters {
  ticketTypeId: string;
  name: string;
}

@injectable()
export class TicketTypeEditor {
  constructor(
    @inject(EventBus) private readonly eventBus: EventBus,
    @inject(TicketTypesRepository) private readonly ticketTypeRepository: TicketTypesRepository
  ) {}

  async execute(params: TicketTypeEditorParamaters) {
    const ticketType = await this.ticketTypeRepository.findById(new TicketTypeId(params.ticketTypeId));
    if (!ticketType) {
      // TODO: Use a custom exception
      throw new Error('Ticket type not found');
    }

    const editedTicketType = ticketType.edit(params.name);
    await this.ticketTypeRepository.save(editedTicketType);

    await this.eventBus.publish(ticketType.pullDomainEvents());
  }
}
