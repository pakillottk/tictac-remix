import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';
import { TicketType } from '../../../domain/ticket-type';
import { TicketTypesRepository } from '../../../domain/ticket-types-repository';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';

export class TicketTypesRepositoryInMemory extends TicketTypesRepository {
  constructor(private readonly ticketTypes: TicketType[] = []) {
    super();
  }
  async save(ticketType: TicketType): Promise<void> {
    this.ticketTypes.push(ticketType);
  }
  async searchByEvent(eventId: EventId): Promise<TicketType[]> {
    return this.ticketTypes.filter((ticketType) => ticketType.eventId.value === eventId.value);
  }
  async search(ticketTypeId: TicketTypeId): Promise<TicketType | null> {
    return this.ticketTypes.find((ticketType) => ticketType.ticketTypeId.value === ticketTypeId.value) || null;
  }

  async searchAll(): Promise<TicketType[]> {
    return this.ticketTypes;
  }
}
