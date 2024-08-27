import 'reflect-metadata';

import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { TicTacEventsRepository } from '../../domain/tictac-events-repository';
import { TicTacEventScanningStarter } from './tictac-event-scanning-starter';
import { TicTacEventsRepositoryInMemory } from '../../infrastructure/persistence/in-memory/tictac-events-repository-in-memory';
import { TicTacEvent } from '../../domain/tictac-event';
import { TicTacEventsMother } from '../../infrastructure/testing/tictac-events-mother';

describe('TictacEventScanningStarter', () => {
  let eventBus: EventBus;
  let tictacEventsRepository: TicTacEventsRepository;
  let tictacEventScanningStarter: TicTacEventScanningStarter;
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
    tictacEventScanningStarter = new TicTacEventScanningStarter(eventBus, tictacEventsRepository);
  });

  it('should start scanning an event', async () => {
    await tictacEventScanningStarter.execute(tictacEvent.eventId.value);

    const scanningTictacEvent = await tictacEventsRepository.find(tictacEvent.eventId);
    expect(scanningTictacEvent).not.toBeNull();
    expect(scanningTictacEvent!.scanning).toBe(true);

    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(eventBus.publish).toHaveBeenCalledWith([
      expect.objectContaining({
        attributes: {
          eventId: tictacEvent.eventId.value,
          name: tictacEvent.name,
        },
      }),
    ]);
  });

  it('should throw an error if the event does not exist', async () => {
    await expect(tictacEventScanningStarter.execute('00000000-0000-0000-0000-000000000000')).rejects.toThrow(
      'Event 00000000-0000-0000-0000-000000000000 not found'
    );
  });

  it('should throw an error if the event is already scanning', async () => {
    await expect(tictacEventScanningStarter.execute(alreadyScanningTictacEvent.eventId.value)).rejects.toThrow(
      'Event ' + alreadyScanningTictacEvent.eventId.value + ' is already scanning'
    );
  });
});
