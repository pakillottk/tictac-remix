import { EventId } from '../../kernel/domain/event-id';
import { TicketTypeId } from '../../kernel/domain/ticket-type-id';
import { TicketType } from './ticket-type';

export abstract class TicketTypesRepository {
  abstract save(ticketType: TicketType): Promise<void>;

  abstract searchByEvent(eventId: EventId): Promise<TicketType[]>;

  abstract findById(ticketTypeId: TicketTypeId): Promise<TicketType | null>;

  abstract searchAll(): Promise<TicketType[]>;

  abstract delete(ticketTypeId: TicketTypeId): Promise<void>;
}
