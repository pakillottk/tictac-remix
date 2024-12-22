import 'reflect-metadata';
import { Container } from 'inversify';

import { QueryHandler } from '@tictac/kernel/src/domain/query-handler';
import { Query } from '@tictac/kernel/src/domain/query';
import { Response } from '@tictac/kernel/src/domain/response';
import { QueryBus } from '@tictac/kernel/src/domain/query-bus';
import { QueryHandlers } from '@tictac/kernel/src/infrastructure/query-bus/query-handlers';
import { InMemoryQueryBus } from '@tictac/kernel/src/infrastructure/query-bus/in-memory-query-bus';

import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { InMemoryAsyncEventBus } from '@tictac/kernel/src/infrastructure/event-bus/in-memory/in-memory-async-event-bus';

import { DomainEventSubscriber } from '@tictac/kernel/src/domain/domain-event-subscriber';
import { DomainEvent } from '@tictac/kernel/src/domain/domain-event';

// TicTacEvents
import { TicTacEventsMother } from '@tictac/tictac/src/events/infrastructure/testing/tictac-events-mother';

import { TicTacEventsRepository } from '@tictac/tictac/src/events/domain/tictac-events-repository';
import { TicTacEventsRepositoryInMemory } from '@tictac/tictac/src/events/infrastructure/persistence/in-memory/tictac-events-repository-in-memory';

import { EventBasicInfoQueryHandler } from '@tictac/tictac/src/events/application/query-handlers/event-basic-info-query-handler';

import { TicTacEventsAllSearcher } from '@tictac/tictac/src/events/application/search-all/tictac-events-all-searcher';
import { TicTacEventsSearchAllController } from '@tictac/tictac/src/events/infrastructure/http/controllers/tictac-events-search-all-controller';
import { TictacEventFinder } from '@tictac/tictac/src/events/application/find/tictac-event-finder';
import { TicTacEventCreator } from '@tictac/tictac/src/events/application/create/tictac-event-creator';
import { TicTacEventScanningStarter } from '@tictac/tictac/src/events/application/start-scanning/tictac-event-scanning-starter';
import { TicTacEventScanningStopper } from '@tictac/tictac/src/events/application/stop-scanning/tictac-event-scanning-stopper';

// TicketTypes
import { TicketTypesMother } from '@tictac/tictac/src/ticket-types/infrastructure/testing/ticket-types-mother';

import { OnBulkCodeCreationUpdateTicketTypeAmmount } from '@tictac/tictac/src/ticket-types/application/event-handlers/on-bulk-code-creation-update-ticket-type-ammount';

import { CodeCountByTicketIdQueryHandler } from '@tictac/tictac/src/codes/application/query-handlers/code-count-by-ticket-id-query-handler';

import { TicketTypesRepository } from '@tictac/tictac/src/ticket-types/domain/ticket-types-repository';
import { TicketTypesRepositoryInMemory } from '@tictac/tictac/src/ticket-types/infrastructure/persistence/in-memory/ticket-types-repository-in-memory';

import { TicketTypesByEventFinder } from '@tictac/tictac/src/ticket-types/application/find-by-event/ticket-types-by-event-finder';
import { TicketTypeCreator } from '@tictac/tictac/src/ticket-types/application/create/ticket-type-creator';
import { TicketTypeEditor } from '@tictac/tictac/src/ticket-types/application/edit/ticket-type-editor';
import { TicketTypeDeleter } from '@tictac/tictac/src/ticket-types/application/delete/ticket-type-deleter';

// Codes
import { CodesMother } from '@tictac/tictac/src/codes/infrastructure/testing/codes-mother';

import { OnTicketTypeEditedUpdateCodesTicketTypes } from '@tictac/tictac/src/codes/application/event-handlers/on-ticket-type-edited-update-codes-ticket-types';
import { OnCodeDeletedDecrementTicketTypeAmmount } from '@tictac/tictac/src/ticket-types/application/event-handlers/on-code-deleted-decrement-ticket-type-ammount';
import { OnCodeScannedIncrementTicketTypeScannedAmmount } from '@tictac/tictac/src/ticket-types/application/event-handlers/on-code-scanned-increment-ticket-type-scanned-ammount';

import { CodesRepository } from '@tictac/tictac/src/codes/domain/codes-repository';
import { CodesRepositoryInMemory } from '@tictac/tictac/src/codes/infrastructure/persistence/in-memory/codes-repository-in-memory';
import { CodeTicketType } from '@tictac/tictac/src/codes/domain/code-ticket-type';
import { CodesByTicketTypesIdsFinder } from '@tictac/tictac/src/codes/application/find-by-ticket-types-ids/codes-by-ticket-types-ids-finder';
import { BulkCodeCreator } from '@tictac/tictac/src/codes/application/bulk-create/bulk-code-creator';
import { CodeDeleter } from '@tictac/tictac/src/codes/application/delete/code-deleter';
import { CodeScanner } from '@tictac/tictac/src/codes/application/scan/code-scanner';
import { TicTacEventsCreateController } from '@tictac/tictac/src/events/infrastructure/http/controllers/tictac-events-create-controller';

// TODO(pgm): These are for development purposes...
const events = Array.from({ length: 2 }, () => TicTacEventsMother.random());
const ticketTypes = events.flatMap((event) => {
  return Array.from({ length: 3 }, () => TicketTypesMother.randomForEvent(event.eventId));
});
const codes = ticketTypes.flatMap((ticketType) => {
  return Array.from({ length: 10 }, () =>
    CodesMother.withTicketType(new CodeTicketType(ticketType.ticketTypeId, ticketType.name), ticketType.eventId)
  );
});

const container = new Container();

// Queries
container.bind<QueryHandler<Query, Response>>(QueryHandler).to(EventBasicInfoQueryHandler);
container.bind<QueryHandler<Query, Response>>(QueryHandler).to(CodeCountByTicketIdQueryHandler);

container.bind<QueryBus>(QueryBus).toDynamicValue((ctx) => {
  const handlers = ctx.container.getAll<QueryHandler<Query, Response>>(QueryHandler);
  const queryBus = new InMemoryQueryBus(new QueryHandlers(handlers));
  return queryBus;
});

// DomainEvents
container.bind<DomainEventSubscriber<DomainEvent>>(DomainEventSubscriber).to(OnTicketTypeEditedUpdateCodesTicketTypes);
container.bind<DomainEventSubscriber<DomainEvent>>(DomainEventSubscriber).to(OnBulkCodeCreationUpdateTicketTypeAmmount);
container.bind<DomainEventSubscriber<DomainEvent>>(DomainEventSubscriber).to(OnCodeDeletedDecrementTicketTypeAmmount);
container
  .bind<DomainEventSubscriber<DomainEvent>>(DomainEventSubscriber)
  .to(OnCodeScannedIncrementTicketTypeScannedAmmount);

container.bind(EventBus).toDynamicValue((ctx) => {
  const eventBus = new InMemoryAsyncEventBus();
  const subscribers = ctx.container.getAll<DomainEventSubscriber<DomainEvent>>(DomainEventSubscriber);
  eventBus.addSubscribers(subscribers);
  return eventBus;
});

// TicTacEvents
container.bind(TicTacEventsRepository).toConstantValue(new TicTacEventsRepositoryInMemory(events));

container.bind(TicTacEventsAllSearcher).to(TicTacEventsAllSearcher);
container.bind(TicTacEventsSearchAllController).to(TicTacEventsSearchAllController);
container.bind(TictacEventFinder).to(TictacEventFinder);
container.bind(TicTacEventCreator).to(TicTacEventCreator);
container.bind(TicTacEventsCreateController).to(TicTacEventsCreateController);
container.bind(TicTacEventScanningStarter).to(TicTacEventScanningStarter);
container.bind(TicTacEventScanningStopper).to(TicTacEventScanningStopper);

// TicketTypes
container.bind(TicketTypesRepository).toConstantValue(new TicketTypesRepositoryInMemory(ticketTypes));

container.bind(TicketTypesByEventFinder).to(TicketTypesByEventFinder);
container.bind(TicketTypeCreator).to(TicketTypeCreator);
container.bind(TicketTypeEditor).to(TicketTypeEditor);
container.bind(TicketTypeDeleter).to(TicketTypeDeleter);

// Codes
container.bind(CodesRepository).toConstantValue(new CodesRepositoryInMemory(codes));

container.bind(CodesByTicketTypesIdsFinder).to(CodesByTicketTypesIdsFinder);
container.bind(BulkCodeCreator).to(BulkCodeCreator);
container.bind(CodeDeleter).to(CodeDeleter);
container.bind(CodeScanner).to(CodeScanner);

export { container };
