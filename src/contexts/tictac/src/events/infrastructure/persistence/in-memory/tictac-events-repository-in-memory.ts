import { injectable } from 'inversify';

import { TicTacEvent } from '../../../domain/tictac-event';
import { TicTacEventsRepository } from '../../../domain/tictac-events-repository';

@injectable()
export class TicTacEventsRepositoryInMemory extends TicTacEventsRepository {
  constructor(private readonly events: TicTacEvent[] = []) {
    super();
  }

  async save(event: TicTacEvent) {
    this.events.push(event);
  }

  async find(eventId: string) {
    return this.events.find((event) => event.eventId === eventId) || null;
  }

  async findAll() {
    return this.events;
  }
}
