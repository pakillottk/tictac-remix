import 'reflect-metadata';

import { TicTacEvent } from '../../domain/tictac-event';
import { TicTacEventsRepository } from '../../domain/tictac-events-repository';
import { TicTacEventsRepositoryInMemory } from '../../infrastructure/persistence/in-memory/tictac-events-repository-in-memory';
import { TicTacEventsMother } from '../../infrastructure/testing/tictac-events-mother';
import { TicTacEventsAllSearcher } from './tictac-events-all-searcher';

describe('TictacEventsAllSearcher', () => {
  let searcher: TicTacEventsAllSearcher;
  let repository: TicTacEventsRepository;
  let events: TicTacEvent[] = Array.from({ length: 3 }, () => TicTacEventsMother.random());

  beforeEach(() => {
    repository = new TicTacEventsRepositoryInMemory(events);
    searcher = new TicTacEventsAllSearcher(repository);
  });

  it('should create an instance', () => {
    expect(searcher).toBeDefined();
  });

  it('should return all events', async () => {
    await expect(searcher.execute()).resolves.toEqual(events.map((event) => event.toPrimitives()));
  });
});
