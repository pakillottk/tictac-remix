import { DomainEvent } from '@tictac/kernel/src/domain/domain-event';

export interface TictacEventScanningStoppedEventAttributes {
  eventId: string;
  name: string;
}

export class TictacEventScanningStoppedEvent extends DomainEvent {
  static EVENT_NAME: string = 'tictac.tictac.events.tictacevents.scanningStopped.1';

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: TictacEventScanningStoppedEventAttributes;
  }): TictacEventScanningStoppedEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params;
    return new TictacEventScanningStoppedEvent(attributes, aggregateId, eventId, occurredOn);
  }

  constructor(
    public readonly attributes: TictacEventScanningStoppedEventAttributes,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super({ eventName: TictacEventScanningStoppedEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
  }

  toPrimitives(): TictacEventScanningStoppedEventAttributes {
    return this.attributes;
  }
}
