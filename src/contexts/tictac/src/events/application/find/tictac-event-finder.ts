import { inject, injectable } from 'inversify';

import { TicTacEventsRepository } from '../../domain/tictac-events-repository';
import { TicTacEventPrimitives } from '../../domain/tictac-event';
import { EventId } from '@tictac/tictac/src/kernel/domain/event-id';

@injectable()
export class TictacEventFinder {
  constructor(@inject(TicTacEventsRepository) private readonly tictacEventsRepository: TicTacEventsRepository) {}

  async execute(eventId: string): Promise<TicTacEventPrimitives> {
    const event = await this.tictacEventsRepository.find(new EventId(eventId));
    if (!event) {
      // TODO: Create a custom error class
      throw new Error(`Event with id ${eventId} not found`);
    }
    return event.toPrimitives();
  }
}
