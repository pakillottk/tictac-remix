import { DomainEvent } from '@tictac/kernel/src/domain/domain-event';

export interface TicketTypeEditedEventAttributes {
  ticketTypeId: string;
  oldValues: {
    name: string;
  };
  newValues: {
    name: string;
  };
  eventId: string;
}

export class TicketTypeEditedEvent extends DomainEvent {
  static EVENT_NAME: string = 'tictac.tictac.events.tickettypes.edited.1';

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: TicketTypeEditedEventAttributes;
  }): TicketTypeEditedEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params;
    return new TicketTypeEditedEvent(attributes, aggregateId, eventId, occurredOn);
  }

  constructor(
    public readonly attributes: TicketTypeEditedEventAttributes,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super({ eventName: TicketTypeEditedEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
  }

  toPrimitives(): TicketTypeEditedEventAttributes {
    return this.attributes;
  }
}
