import { inject, injectable } from 'inversify';
import { TicketTypesRepository } from '../../domain/ticket-types-repository';
import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';

@injectable()
export class TicketTypeDeleter {
  constructor(
    @inject(EventBus) private readonly eventBus: EventBus,
    @inject(TicketTypesRepository) private readonly ticketTypesRepository: TicketTypesRepository
  ) {}

  async execute(ticketTypeId: string) {
    const ticketType = await this.ticketTypesRepository.findById(new TicketTypeId(ticketTypeId));
    if (!ticketType) {
      throw new Error('Ticket type not found');
    }

    ticketType.delete();
    await this.ticketTypesRepository.delete(ticketType.ticketTypeId);

    await this.eventBus.publish(ticketType.pullDomainEvents());
  }
}
