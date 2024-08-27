import { DomainEvent } from '@tictac/kernel/src/domain/domain-event';

export interface TictacEventScanningStartedEventAttributes {
  eventId: string;
  name: string;
}

export class TictacEventScanningStartedEvent extends DomainEvent {
  static EVENT_NAME: string = 'tictac.tictac.events.tictacevents.scanningStarted.1';

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: TictacEventScanningStartedEventAttributes;
  }): TictacEventScanningStartedEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params;
    return new TictacEventScanningStartedEvent(attributes, aggregateId, eventId, occurredOn);
  }

  constructor(
    public readonly attributes: TictacEventScanningStartedEventAttributes,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super({ eventName: TictacEventScanningStartedEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
  }

  toPrimitives(): TictacEventScanningStartedEventAttributes {
    return this.attributes;
  }
}
