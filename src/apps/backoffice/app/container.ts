import 'reflect-metadata';

import { Container } from 'inversify';

import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { InMemoryAsyncEventBus } from '@tictac/kernel/src/infrastructure/event-bus/in-memory/in-memory-async-event-bus';

import { TicTacEventsRepository } from '@tictac/tictac/src/events/domain/tictac-events-repository';
import { TicTacEventsRepositoryInMemory } from '@tictac/tictac/src/events/infrastructure/persistence/in-memory/tictac-events-repository-in-memory';
import { TicTacEventsAllSearcher } from '@tictac/tictac/src/events/application/search-all/tictac-events-all-searcher';
import { TicTacEventsMother } from '@tictac/tictac/src/events/infrastructure/testing/tictac-events-mother';
import { TictacEventFinder } from '@tictac/tictac/src/events/application/find/tictac-event-finder';
import { TicTacEventCreator } from '@tictac/tictac/src/events/application/create/tictac-event-creator';

const container = new Container();

container.bind<EventBus>(EventBus).toConstantValue(new InMemoryAsyncEventBus());

container
  .bind<TicTacEventsRepository>(TicTacEventsRepository)
  .toConstantValue(new TicTacEventsRepositoryInMemory(Array.from({ length: 2 }, () => TicTacEventsMother.random())));

container.bind<TicTacEventsAllSearcher>(TicTacEventsAllSearcher).to(TicTacEventsAllSearcher);
container.bind<TictacEventFinder>(TictacEventFinder).to(TictacEventFinder);
container.bind<TicTacEventCreator>(TicTacEventCreator).to(TicTacEventCreator);

export { container };
