import { fa, faker } from '@faker-js/faker';
import { TicketType } from '../../domain/ticket-type';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';

export class TicketTypesMother {
  static random(): TicketType {
    return TicketType.fromPrimitives({
      ticketTypeId: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: faker.number.float({ min: 0, max: 1000 }),
      ammount: faker.number.int({ min: 1 }),
      scannedAmmount: faker.number.int({ min: 0 }),
      eventId: faker.string.uuid(),
    });
  }

  static randomForEvent(eventId: EventId): TicketType {
    return TicketType.fromPrimitives({
      ticketTypeId: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: faker.number.float({ min: 0, max: 1000, fractionDigits: 2 }),
      ammount: faker.number.int({ min: 1 }),
      scannedAmmount: faker.number.int({ min: 0 }),
      eventId: eventId.value,
    });
  }
}
