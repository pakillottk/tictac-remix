import { faker } from '@faker-js/faker';
import { TicketType } from '../../domain/ticket-type';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';

export class TicketTypesMother {
  static random(): TicketType {
    return TicketType.fromPrimitives({
      ticketTypeId: faker.string.uuid(),
      name: faker.commerce.productName(),
      ammount: faker.number.int({ min: 100, max: 20000 }),
      scannedAmmount: faker.number.int({ min: 0, max: 20000 }),
      eventId: faker.string.uuid(),
    });
  }

  static randomForEvent(eventId: EventId): TicketType {
    return TicketType.fromPrimitives({
      ticketTypeId: faker.string.uuid(),
      name: faker.commerce.productName(),
      ammount: faker.number.int({ min: 100, max: 20000 }),
      scannedAmmount: faker.number.int({ min: 0, max: 20000 }),
      eventId: eventId.value,
    });
  }
}
