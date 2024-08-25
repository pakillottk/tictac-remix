import { AggregateRoot } from '@tictac/kernel/src/domain/aggregate-root';
import { TicketTypeId } from '../../kernel/domain/ticket-type-id';
import { EventId } from '../../kernel/domain/event-id';

export interface TicketTypePrimitives {
  ticketTypeId: string;
  name: string;
  price: number;
  ammount: number;
  scannedAmmount: number;
  eventId: string;
}

export class TicketType extends AggregateRoot {
  static fromPrimitives(primitives: TicketTypePrimitives): TicketType {
    return new TicketType(
      new TicketTypeId(primitives.ticketTypeId),
      primitives.name,
      primitives.price,
      primitives.ammount,
      primitives.scannedAmmount,
      new EventId(primitives.eventId)
    );
  }

  constructor(
    public readonly ticketTypeId: TicketTypeId,
    public readonly name: string,
    public readonly price: number,
    public readonly ammount: number,
    public readonly scannedAmmount: number,
    public readonly eventId: EventId
  ) {
    super();
  }

  toPrimitives() {
    return {
      ticketTypeId: this.ticketTypeId.value,
      name: this.name,
      price: this.price,
      ammount: this.ammount,
      scannedAmmount: this.scannedAmmount,
      eventId: this.eventId.value,
    };
  }
}
