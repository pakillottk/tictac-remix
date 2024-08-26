import { DomainEvent } from '@tictac/kernel/src/domain/domain-event';

export interface CodeCreatedEventAttributes {
  code: string;
  ticketTypeId: string;
  eventId: string;
}

export class CodeCreatedEvent extends DomainEvent {
  static EVENT_NAME: string = 'tictac.tictac.events.codes.created.1';

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: CodeCreatedEventAttributes;
  }): CodeCreatedEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params;
    return new CodeCreatedEvent(attributes, aggregateId, eventId, occurredOn);
  }

  constructor(
    public readonly attributes: CodeCreatedEventAttributes,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super({ eventName: CodeCreatedEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
  }

  toPrimitives(): CodeCreatedEventAttributes {
    return this.attributes;
  }
}
