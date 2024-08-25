import { inject, injectable } from 'inversify';
import { TicketTypesRepository } from '../../domain/ticket-types-repository';
import { TicketType } from '../../domain/ticket-type';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';
import { EventBus } from '@tictac/kernel/src/domain/event-bus';

export interface TicketTypeCreatorParameters {
  ticketTypeId: string;
  name: string;
  price: number;
  eventId: string;
}

@injectable()
export class TicketTypeCreator {
  constructor(
    @inject(EventBus) private readonly eventBus: EventBus,
    @inject(TicketTypesRepository) private readonly ticketTypesRepository: TicketTypesRepository
  ) {}

  async execute(parameters: TicketTypeCreatorParameters) {
    // TODO(pgm) Check that event exists...

    const ticketType = TicketType.create(
      new TicketTypeId(parameters.ticketTypeId),
      parameters.name,
      parameters.price,
      new EventId(parameters.eventId)
    );
    await this.ticketTypesRepository.save(ticketType);

    this.eventBus.publish(ticketType.pullDomainEvents());
  }
}
