import { TicTacEvent, TicTacEventPrimitives } from '../../domain/tictac-event';
import { buildFactory } from 'ts-factory';
import { faker } from '@faker-js/faker';

export class TicTacEventsMother {
  private static readonly buildEvent = buildFactory<TicTacEventPrimitives>({
    eventId: faker.string.uuid(),
    name: faker.commerce.product(),
    description: faker.lorem.paragraph(),
    eventLocation: faker.location.streetAddress(),
    eventDate: faker.date.recent(),
    scanning: faker.datatype.boolean(),
    ownerId: faker.string.uuid(),
    ownerName: faker.company.name(),
    eventImage: faker.image.url(),
  });

  static random(scanning?: boolean): TicTacEvent {
    return TicTacEvent.fromPrimitives(
      this.buildEvent({
        eventId: faker.string.uuid(),
        name: faker.commerce.product(),
        description: faker.lorem.paragraph(),
        eventLocation: faker.location.streetAddress(),
        eventDate: faker.date.recent(),
        scanning: scanning ?? faker.datatype.boolean(),
        ownerId: faker.string.uuid(),
        ownerName: faker.company.name(),
        eventImage: faker.image.url(),
      })
    );
  }
}
