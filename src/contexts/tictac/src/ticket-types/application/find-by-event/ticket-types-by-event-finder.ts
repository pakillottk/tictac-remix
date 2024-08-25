import { inject, injectable } from 'inversify';
import { TicketTypesRepository } from '../../domain/ticket-types-repository';
import { TicketTypePrimitives } from '../../domain/ticket-type';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';

export type FoundTicketType = TicketTypePrimitives;

@injectable()
export class TicketTypesByEventFinder {
  constructor(@inject(TicketTypesRepository) private readonly ticketTypesRepository: TicketTypesRepository) {}

  async execute(eventId: string): Promise<FoundTicketType[]> {
    return (await this.ticketTypesRepository.searchByEvent(new EventId(eventId))).map((ticketType) =>
      ticketType.toPrimitives()
    );
  }
}
