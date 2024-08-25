import { DomainEvent } from '@tictac/kernel/src/domain/domain-event';

export interface TicketTypeUpdatedEventAttributes {
  ticketTypeId: string;
  oldValues: {
    name: string;
    price: number;
  };
  newValues: {
    name: string;
    price: number;
  };
  eventId: string;
}

export class TicketTypeUpdatedEvent extends DomainEvent {
  static EVENT_NAME: string = 'tictac.tictac.events.tickettypes.updated.1';

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: TicketTypeUpdatedEventAttributes;
  }): TicketTypeUpdatedEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params;
    return new TicketTypeUpdatedEvent(attributes, aggregateId, eventId, occurredOn);
  }

  constructor(
    public readonly attributes: TicketTypeUpdatedEventAttributes,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super({ eventName: TicketTypeUpdatedEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
  }

  toPrimitives(): TicketTypeUpdatedEventAttributes {
    return this.attributes;
  }
}
