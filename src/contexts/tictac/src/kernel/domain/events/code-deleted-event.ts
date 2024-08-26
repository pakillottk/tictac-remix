import { DomainEvent } from '@tictac/kernel/src/domain/domain-event';

export interface CodeDeletedEventAttributes {
  code: string;
  ticketTypeId: string;
  eventId: string;
}

export class CodeDeletedEvent extends DomainEvent {
  static EVENT_NAME: string = 'tictac.tictac.events.codes.deleted.1';

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: CodeDeletedEventAttributes;
  }): CodeDeletedEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params;
    return new CodeDeletedEvent(attributes, aggregateId, eventId, occurredOn);
  }

  constructor(
    public readonly attributes: CodeDeletedEventAttributes,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super({ eventName: CodeDeletedEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
  }

  toPrimitives(): CodeDeletedEventAttributes {
    return this.attributes;
  }
}
