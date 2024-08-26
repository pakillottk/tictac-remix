import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';
import { Code } from '../../domain/code';
import { TicketCode } from '../../domain/ticket-code';
import { faker } from '@faker-js/faker';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';
import { CodeTicketType } from '../../domain/code-ticket-type';

export class CodesMother {
  static random(scanned: boolean = false): Code {
    return Code.fromPrimitives({
      code: TicketCode.random().value,
      ticketType: {
        id: TicketTypeId.random().value,
        name: faker.commerce.product(),
      },
      eventId: faker.string.uuid(),
      scannedAt: scanned ? faker.date.recent() : null,
      scannedBy: scanned
        ? {
            id: faker.string.uuid(),
            name: faker.person.firstName(),
          }
        : null,
    });
  }

  static withTicketType(ticketType: CodeTicketType, eventId?: EventId): Code {
    return Code.fromPrimitives({
      code: TicketCode.random().value,
      ticketType: ticketType.toPrimitives(),
      eventId: eventId?.value || faker.string.uuid(),
      scannedAt: null,
      scannedBy: null,
    });
  }
}
