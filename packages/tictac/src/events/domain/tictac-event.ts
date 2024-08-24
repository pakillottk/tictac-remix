import { AggregateRoot } from '@tictac/kernel/src/domain/aggregate-root';
import { Option, fromNullable, toNullable } from 'fp-ts/Option';

export interface TicTacEventPrimitives {
  eventId: string;
  name: string;
  description: string;
  eventLocation: string;
  eventDate: Date;
  scanning: boolean;
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
    public readonly eventImage: Option<string>
  ) {
    super();
  }

  static fromPrimitives(primitives: TicTacEventPrimitives): TicTacEvent {
    return new TicTacEvent(
      primitives.eventId,
      primitives.name,
      primitives.description,
      primitives.eventLocation,
      primitives.eventDate,
      primitives.scanning,
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
      eventImage: toNullable(this.eventImage),
    };
  }
}
