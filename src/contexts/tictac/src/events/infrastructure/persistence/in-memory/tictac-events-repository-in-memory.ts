import { injectable } from 'inversify';

import { TicTacEvent } from '../../../domain/tictac-event';
import { TicTacEventsRepository } from '../../../domain/tictac-events-repository';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';

@injectable()
export class TicTacEventsRepositoryInMemory extends TicTacEventsRepository {
  constructor(private readonly events: TicTacEvent[] = []) {
    super();
  }

  async save(event: TicTacEvent) {
    this.events.push(event);
  }

  async find(eventId: EventId) {
    return this.events.find((event) => event.eventId.value === eventId.value) || null;
  }

  async findAll() {
    return this.events;
  }
}
