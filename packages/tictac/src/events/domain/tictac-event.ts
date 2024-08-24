import { AggregateRoot } from '@tictac/kernel/src/domain/aggregate-root';
import { Option, fromNullable, toNullable } from 'fp-ts/Option';
import { TicTacEventCreatedEvent } from '../../kernel/domain/events/tictac-event-created-event';

export interface TicTacEventPrimitives {
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

export class TicTacEvent extends AggregateRoot {
  constructor(
    public readonly eventId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly eventLocation: string,
    public readonly eventDate: Date,
    public readonly scanning: boolean,
    public readonly ownerId: string,
    public readonly ownerName: string,
    public readonly eventImage: Option<string>
  ) {
    super();
  }

  static create(
    eventId: string,
    name: string,
    description: string,
    eventLocation: string,
    eventDate: Date,
    scanning: boolean,
    ownerId: string,
    ownerName: string,
    eventImage: Option<string>
  ): TicTacEvent {
    const event = new TicTacEvent(
      eventId,
      name,
      description,
      eventLocation,
      eventDate,
      scanning,
      ownerId,
      ownerName,
      eventImage
    );

    event.record(new TicTacEventCreatedEvent(event.toPrimitives(), eventId));

    return event;
  }

  static fromPrimitives(primitives: TicTacEventPrimitives): TicTacEvent {
    return new TicTacEvent(
      primitives.eventId,
      primitives.name,
      primitives.description,
      primitives.eventLocation,
      primitives.eventDate,
      primitives.scanning,
      primitives.ownerId,
      primitives.ownerName,
      fromNullable(primitives.eventImage)
    );
  }

  toPrimitives(): TicTacEventPrimitives {
    return {
      eventId: this.eventId,
      name: this.name,
      description: this.description,
      eventLocation: this.eventLocation,
      eventDate: this.eventDate,
      scanning: this.scanning,
      ownerId: this.ownerId,
      ownerName: this.ownerName,
      eventImage: toNullable(this.eventImage),
    };
  }
}
