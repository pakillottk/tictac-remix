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

import { TicketTypesRepository } from '@tictac/tictac/src/ticket-types/domain/ticket-types-repository';
import { TicketTypesRepositoryInMemory } from '@tictac/tictac/src/ticket-types/infrastructure/persistence/in-memory/ticket-types-repository-in-memory';
import { TicketTypesByEventFinder } from '@tictac/tictac/src/ticket-types/application/find-by-event/ticket-types-by-event-finder';
import { TicketTypesMother } from '@tictac/tictac/src/ticket-types/infrastructure/testing/ticket-types-mother';

// TODO(pgm): These are for development purposes...
const events = Array.from({ length: 2 }, () => TicTacEventsMother.random());
const ticketTypes = events.flatMap((event) => {
  return Array.from({ length: 3 }, () => TicketTypesMother.randomForEvent(event.eventId));
});

const container = new Container();

container.bind<EventBus>(EventBus).toConstantValue(new InMemoryAsyncEventBus());

// TicTacEvents
container.bind(TicTacEventsRepository).toConstantValue(new TicTacEventsRepositoryInMemory(events));

container.bind<TicTacEventsAllSearcher>(TicTacEventsAllSearcher).to(TicTacEventsAllSearcher);
container.bind<TictacEventFinder>(TictacEventFinder).to(TictacEventFinder);
container.bind<TicTacEventCreator>(TicTacEventCreator).to(TicTacEventCreator);

// TicketTypes
container.bind(TicketTypesRepository).toConstantValue(new TicketTypesRepositoryInMemory(ticketTypes));

container.bind(TicketTypesByEventFinder).to(TicketTypesByEventFinder);

export { container };
