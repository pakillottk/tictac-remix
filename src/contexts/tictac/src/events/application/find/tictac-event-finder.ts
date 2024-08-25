import { inject, injectable } from 'inversify';

import { TicTacEventsRepository } from '../../domain/tictac-events-repository';
import { TicTacEventPrimitives } from '../../domain/tictac-event';

@injectable()
export class TictacEventFinder {
  constructor(@inject(TicTacEventsRepository) private readonly tictacEventsRepository: TicTacEventsRepository) {}

  async execute(eventId: string): Promise<TicTacEventPrimitives> {
    const event = await this.tictacEventsRepository.find(eventId);
    if (!event) {
      // TODO: Create a custom error class
      throw new Error(`Event with id ${eventId} not found`);
    }
    return event.toPrimitives();
  }
}
