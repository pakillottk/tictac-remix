import { AggregateRoot } from '@tictac/kernel/src/domain/aggregate-root';
import { TicketTypeId } from '../../kernel/domain/ticket-type-id';
import { EventId } from '../../kernel/domain/event-id';
import { TicketTypeCreatedEvent } from '../../kernel/domain/events/ticket-type-created-event';
import { TicketTypeUpdatedEvent } from '../../kernel/domain/events/ticket-type-edited-event';
import { TicketTypeDeletedEvent } from '../../kernel/domain/events/ticket-type-deleted-event';

export interface TicketTypePrimitives {
  ticketTypeId: string;
  name: string;
  ammount: number;
  scannedAmmount: number;
  eventId: string;
}

export class TicketType extends AggregateRoot {
  static fromPrimitives(primitives: TicketTypePrimitives): TicketType {
    return new TicketType(
      new TicketTypeId(primitives.ticketTypeId),
      primitives.name,
      primitives.ammount,
      primitives.scannedAmmount,
      new EventId(primitives.eventId)
    );
  }

  constructor(
    public readonly ticketTypeId: TicketTypeId,
    public readonly name: string,
    public readonly ammount: number,
    public readonly scannedAmmount: number,
    public readonly eventId: EventId
  ) {
    super();
  }

  static create(ticketTypeId: TicketTypeId, name: string, eventId: EventId): TicketType {
    const ticketType = new TicketType(ticketTypeId, name, 0, 0, eventId);
    ticketType.record(
      new TicketTypeCreatedEvent({ ticketTypeId: ticketTypeId.value, name, eventId: eventId.value }, ticketTypeId.value)
    );
    return ticketType;
  }

  public edit(name: string): TicketType {
    const editedTicketType = new TicketType(this.ticketTypeId, name, this.ammount, this.scannedAmmount, this.eventId);

    this.record(
      new TicketTypeUpdatedEvent(
        {
          ticketTypeId: this.ticketTypeId.value,
          oldValues: { name: this.name },
          newValues: { name },
          eventId: this.eventId.value,
        },
        this.ticketTypeId.value
      )
    );

    return editedTicketType;
  }

  public delete(): void {
    this.record(new TicketTypeDeletedEvent(this.toPrimitives(), this.ticketTypeId.value));
  }

  toPrimitives() {
    return {
      ticketTypeId: this.ticketTypeId.value,
      name: this.name,
      ammount: this.ammount,
      scannedAmmount: this.scannedAmmount,
      eventId: this.eventId.value,
    };
  }
}
