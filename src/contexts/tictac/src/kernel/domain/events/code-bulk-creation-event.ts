import { DomainEvent } from '@tictac/kernel/src/domain/domain-event';

export interface CodeBulkCreationEventAttributes {
  ammount: number;
  ticketTypeIds: string[];
}

export class CodeBulkCreationEvent extends DomainEvent {
  static EVENT_NAME: string = 'tictac.tictac.events.codes.bulkCreated.1';

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: CodeBulkCreationEventAttributes;
  }): CodeBulkCreationEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params;
    return new CodeBulkCreationEvent(attributes, aggregateId, eventId, occurredOn);
  }

  constructor(
    public readonly attributes: CodeBulkCreationEventAttributes,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super({ eventName: CodeBulkCreationEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
  }

  toPrimitives(): CodeBulkCreationEventAttributes {
    return this.attributes;
  }
}
