import { DomainEvent } from '@tictac/kernel/src/domain/domain-event';

export interface CodeScannedEventAttributes {
  code: string;
  ticketTypeId: string;
  eventId: string;
  scannedBy: {
    id: string;
    name: string;
  };
}

export class CodeScannedEvent extends DomainEvent {
  static EVENT_NAME: string = 'tictac.tictac.events.codes.scanned.1';

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: CodeScannedEventAttributes;
  }): CodeScannedEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params;
    return new CodeScannedEvent(attributes, aggregateId, eventId, occurredOn);
  }

  constructor(
    public readonly attributes: CodeScannedEventAttributes,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super({ eventName: CodeScannedEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
  }

  toPrimitives(): CodeScannedEventAttributes {
    return this.attributes;
  }
}
