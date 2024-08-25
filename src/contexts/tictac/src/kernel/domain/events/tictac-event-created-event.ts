import { DomainEvent } from '@tictac/kernel/src/domain/domain-event';

export interface TicTacEventCreatedEventAttributes {
  eventId: string;
  name: string;
  description: string;
  eventLocation: string;
  eventDate: Date;
  scanning: boolean;
  ownerId: string;
  ownerName: string;
  eventImage?: string | null;
}

export class TicTacEventCreatedEvent extends DomainEvent {
  static EVENT_NAME: string = 'tictac.tictac.events.tictacevent.created.1';

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: TicTacEventCreatedEventAttributes;
  }): TicTacEventCreatedEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params;
    return new TicTacEventCreatedEvent(attributes, aggregateId, eventId, occurredOn);
  }

  constructor(
    public readonly attributes: TicTacEventCreatedEventAttributes,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super({ eventName: TicTacEventCreatedEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
  }

  toPrimitives(): TicTacEventCreatedEventAttributes {
    return this.attributes;
  }
}
