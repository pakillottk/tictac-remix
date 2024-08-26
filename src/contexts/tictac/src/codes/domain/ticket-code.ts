import { InvalidArgumentError } from '@tictac/kernel/src/domain/value-object/invalid-argument-error';
import { StringValueObject } from '@tictac/kernel/src/domain/value-object/string-value-object';
import { nanoid } from 'nanoid';

export class TicketCode extends StringValueObject {
  constructor(value: string) {
    super(value);

    this.validate(value);
  }

  static random(): TicketCode {
    return new TicketCode(nanoid());
  }

  private validate(value: string): void {
    if (value.length < 4) {
      throw new InvalidArgumentError('Ticket code must be at least 4 characters long');
    }
  }
}
