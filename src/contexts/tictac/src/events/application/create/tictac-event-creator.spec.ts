import 'reflect-metadata';

import { TicTacEventCreator, TicTacEventCreatorParams } from './tictac-event-creator';
import { TicTacEventsRepository } from '../../domain/tictac-events-repository';
import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { TicTacEvent } from '../../domain/tictac-event';
import { TicTacEventsMother } from '../../infrastructure/testing/tictac-events-mother';
import { TicTacEventCreatedEvent } from '../../../kernel/domain/events/tictac-event-created-event';

describe('TicTacEventCreator', () => {
  let eventBus: EventBus;
  let tictacEventsRepository: TicTacEventsRepository;
  let tictacEventCreator: TicTacEventCreator;

  beforeEach(() => {
    eventBus = {
      publish: jest.fn(),
      addSubscribers: jest.fn(),
    };

    tictacEventsRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
    };

    tictacEventCreator = new TicTacEventCreator(eventBus, tictacEventsRepository);
  });

  it('should create and save a new TicTacEvent', async () => {
    const params: TicTacEventCreatorParams = TicTacEventsMother.random().toPrimitives();

    await tictacEventCreator.execute(params);

    expect(tictacEventsRepository.save).toHaveBeenCalledWith(expect.any(TicTacEvent));
    expect(eventBus.publish).toHaveBeenCalledWith(expect.arrayContaining([expect.any(TicTacEventCreatedEvent)]));
  });

  it('should throw an error if event creation fails', async () => {
    const params: TicTacEventCreatorParams = TicTacEventsMother.random().toPrimitives();

    jest.spyOn(tictacEventsRepository, 'save').mockImplementationOnce(() => {
      throw new Error('Failed to save event');
    });

    await expect(tictacEventCreator.execute(params)).rejects.toThrow('Failed to save event');
    expect(eventBus.publish).not.toHaveBeenCalled();
  });

  it('should publish the correct event', async () => {
    const params: TicTacEventCreatorParams = TicTacEventsMother.random().toPrimitives();
    const expectedEvent = new TicTacEventCreatedEvent(params, params.eventId);

    await tictacEventCreator.execute(params);

    expect(eventBus.publish).toHaveBeenCalledWith([
      expect.objectContaining({ attributes: expectedEvent.toPrimitives() }),
    ]);
  });
});
