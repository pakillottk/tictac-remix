import 'reflect-metadata';

import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { TicTacEventsRepository } from '../../domain/tictac-events-repository';
import { TicTacEventScanningStopper } from './tictac-event-scanning-stopper';
import { TicTacEventsRepositoryInMemory } from '../../infrastructure/persistence/in-memory/tictac-events-repository-in-memory';
import { TicTacEvent } from '../../domain/tictac-event';
import { TicTacEventsMother } from '../../infrastructure/testing/tictac-events-mother';

describe('TicTacEventScanningStopper', () => {
  let eventBus: EventBus;
  let tictacEventsRepository: TicTacEventsRepository;
  let tictacEventScanningStopper: TicTacEventScanningStopper;
  let tictacEvent: TicTacEvent;
  let alreadyScanningTictacEvent: TicTacEvent;

  beforeEach(() => {
    eventBus = {
      publish: jest.fn(),
      addSubscribers: jest.fn(),
    };

    tictacEvent = TicTacEventsMother.random(false);
    alreadyScanningTictacEvent = TicTacEventsMother.random(true);
    tictacEventsRepository = new TicTacEventsRepositoryInMemory([tictacEvent, alreadyScanningTictacEvent]);
    tictacEventScanningStopper = new TicTacEventScanningStopper(eventBus, tictacEventsRepository);
  });

  it('should stop scanning an event', async () => {
    await tictacEventScanningStopper.execute(alreadyScanningTictacEvent.eventId.value);

    const nonScanningTictacEvent = await tictacEventsRepository.find(alreadyScanningTictacEvent.eventId);
    expect(nonScanningTictacEvent).not.toBeNull();
    expect(nonScanningTictacEvent!.scanning).toBe(false);

    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(eventBus.publish).toHaveBeenCalledWith([
      expect.objectContaining({
        attributes: {
          eventId: alreadyScanningTictacEvent.eventId.value,
          name: alreadyScanningTictacEvent.name,
        },
      }),
    ]);
  });

  it('should throw an error if the event does not exist', async () => {
    await expect(tictacEventScanningStopper.execute('00000000-0000-0000-0000-000000000000')).rejects.toThrow(
      'Event 00000000-0000-0000-0000-000000000000 not found'
    );
  });

  it('should throw an error if the event is not scanning yet', async () => {
    await expect(tictacEventScanningStopper.execute(tictacEvent.eventId.value)).rejects.toThrow(
      'Event ' + tictacEvent.eventId.value + ' is not scanning yet'
    );
  });
});
