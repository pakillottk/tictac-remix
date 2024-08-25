import { DomainEvent } from '@tictac/kernel/src/domain/domain-event';
import { TicketTypePrimitives } from '@tictac/tictac/src/ticket-types/domain/ticket-type';

export type TicketTypeDeletedEventAttributes = TicketTypePrimitives;

export class TicketTypeDeletedEvent extends DomainEvent {
  static EVENT_NAME: string = 'tictac.tictac.events.tickettypes.deleted.1';

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: TicketTypeDeletedEventAttributes;
  }): TicketTypeDeletedEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params;
    return new TicketTypeDeletedEvent(attributes, aggregateId, eventId, occurredOn);
  }

  constructor(
    public readonly attributes: TicketTypeDeletedEventAttributes,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super({ eventName: TicketTypeDeletedEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
  }

  toPrimitives(): TicketTypeDeletedEventAttributes {
    return this.attributes;
  }
}
