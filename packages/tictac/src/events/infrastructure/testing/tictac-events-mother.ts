import { TicTacEvent, TicTacEventPrimitives } from '../../domain/tictac-event';
import { buildFactory } from 'ts-factory';
import { faker } from '@faker-js/faker';

export class TicTacEventsMother {
  private static readonly buildEvent = buildFactory<TicTacEventPrimitives>({
    eventId: faker.string.uuid(),
    name: faker.commerce.product(),
    description: faker.lorem.paragraph(),
    eventLocation: faker.location.direction(),
    eventDate: faker.date.recent(),
    scanning: faker.datatype.boolean(),
    eventImage: faker.image.url(),
  });

  static random(): TicTacEvent {
    return TicTacEvent.fromPrimitives(
      this.buildEvent({
        eventId: faker.string.uuid(),
        name: faker.commerce.product(),
        description: faker.lorem.paragraph(),
        eventLocation: faker.location.direction(),
        eventDate: faker.date.recent(),
        scanning: faker.datatype.boolean(),
        eventImage: faker.image.url(),
      })
    );
  }
}
