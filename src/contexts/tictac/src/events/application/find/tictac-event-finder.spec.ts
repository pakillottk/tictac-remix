import 'reflect-metadata';

import { TicTacEventsRepositoryInMemory } from '../../infrastructure/persistence/in-memory/tictac-events-repository-in-memory';
import { TicTacEventsMother } from '../../infrastructure/testing/tictac-events-mother';
import { TictacEventFinder } from './tictac-event-finder';

describe('TictacEventFinder', () => {
  it('should return the event', async () => {
    // Arrange
    const event = TicTacEventsMother.random();
    const tictacEventsRepository = new TicTacEventsRepositoryInMemory([event]);
    const tictacEventFinder = new TictacEventFinder(tictacEventsRepository);

    // Act
    const result = await tictacEventFinder.execute(event.eventId.value);

    // Assert
    expect(result).toEqual(event.toPrimitives());
  });

  it('should throw an error if the event is not found', async () => {
    // Arrange
    const eventId = '00000000-0000-0000-0000-000000000000';
    const tictacEventsRepository = new TicTacEventsRepositoryInMemory([]);
    const tictacEventFinder = new TictacEventFinder(tictacEventsRepository);

    // Act
    const action = async () => await tictacEventFinder.execute(eventId);

    // Assert
    await expect(action()).rejects.toThrow(`Event with id ${eventId} not found`);
  });
});
