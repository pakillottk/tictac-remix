import { Uuid } from '@tictac/kernel/src/domain/value-object/uuid';

export class EventId extends Uuid {
  static random(): EventId {
    return new EventId(Uuid.random().value);
  }
}
