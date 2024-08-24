import 'reflect-metadata';

import { Container } from 'inversify';
import { TicTacEventsRepository } from '../../tictac/src/events/domain/tictac-events-repository';
import { TicTacEventsRepositoryInMemory } from '../../tictac/src/events/infrastructure/persistence/in-memory/tictac-events-repository-in-memory';
import { TicTacEventsAllSearcher } from '../../tictac/src/events/application/search-all/tictac-events-all-searcher';
import { TicTacEvent } from '../../tictac/src/events/domain/tictac-event';
import { TicTacEventsMother } from '../../tictac/src/events/infrastructure/testing/tictac-events-mother';
import { TictacEventFinder } from '../../tictac/src/events/application/find/tictac-event-finder';

const container = new Container();
// container.bind<TicTacEventsRepository>(TicTacEventsRepository).to(TicTacEventsRepositoryInMemory);
container
  .bind<TicTacEventsRepository>(TicTacEventsRepository)
  .toConstantValue(new TicTacEventsRepositoryInMemory(Array.from({ length: 50 }, () => TicTacEventsMother.random())));
container.bind<TicTacEventsAllSearcher>(TicTacEventsAllSearcher).to(TicTacEventsAllSearcher);
container.bind<TictacEventFinder>(TictacEventFinder).to(TictacEventFinder);

export { container };
