import { Uuid } from '@tictac/kernel/src/domain/value-object/uuid';

export class TicketTypeId extends Uuid {
  static random(): TicketTypeId {
    return new TicketTypeId(Uuid.random().value);
  }
}
