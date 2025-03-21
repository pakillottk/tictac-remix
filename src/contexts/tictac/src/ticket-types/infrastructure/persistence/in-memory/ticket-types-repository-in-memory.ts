import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';
import { TicketType } from '../../../domain/ticket-type';
import { TicketTypesRepository } from '../../../domain/ticket-types-repository';
import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';

export class TicketTypesRepositoryInMemory extends TicketTypesRepository {
  constructor(private readonly ticketTypes: TicketType[] = []) {
    super();
  }

  async save(ticketType: TicketType): Promise<void> {
    const index = this.ticketTypes.findIndex((t) => t.ticketTypeId.value === ticketType.ticketTypeId.value);
    if (index === -1) {
      this.ticketTypes.push(ticketType);
    } else {
      this.ticketTypes[index] = ticketType;
    }
  }

  async searchByEvent(eventId: EventId): Promise<TicketType[]> {
    return this.ticketTypes.filter((ticketType) => ticketType.eventId.value === eventId.value);
  }
  async findById(ticketTypeId: TicketTypeId): Promise<TicketType | null> {
    return this.ticketTypes.find((ticketType) => ticketType.ticketTypeId.value === ticketTypeId.value) || null;
  }

  async searchAll(): Promise<TicketType[]> {
    return this.ticketTypes;
  }

  async delete(ticketTypeId: TicketTypeId): Promise<void> {
    const index = this.ticketTypes.findIndex((t) => t.ticketTypeId.value === ticketTypeId.value);
    if (index !== -1) {
      this.ticketTypes.splice(index, 1);
    } else {
      throw new Error('Ticket type not found');
    }
  }
}
