import { DomainEvent } from '@tictac/kernel/src/domain/domain-event';

export interface TicketTypeCreatedEventAttributes {
  ticketTypeId: string;
  name: string;
  price: number;
  eventId: string;
}

export class TicketTypeCreatedEvent extends DomainEvent {
  static EVENT_NAME: string = 'tictac.tictac.events.tickettypes.created.1';

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: TicketTypeCreatedEventAttributes;
  }): TicketTypeCreatedEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params;
    return new TicketTypeCreatedEvent(attributes, aggregateId, eventId, occurredOn);
  }

  constructor(
    public readonly attributes: TicketTypeCreatedEventAttributes,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super({ eventName: TicketTypeCreatedEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
  }

  toPrimitives(): TicketTypeCreatedEventAttributes {
    return this.attributes;
  }
}
