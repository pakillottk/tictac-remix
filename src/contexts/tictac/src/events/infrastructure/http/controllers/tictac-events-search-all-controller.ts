import { ControllerBase } from '@tictac/kernel/src/domain/http/controller-base';
import { inject, injectable } from 'inversify';
import { TicTacEventsAllSearcher } from '../../../application/search-all/tictac-events-all-searcher';
import { TicTacEventPrimitives } from '../../../domain/tictac-event';

import { Request } from '@tictac/kernel/src/domain/http/request';
import { Response } from '@tictac/kernel/src/domain/http/response';

export interface TicTacEventsSearchAllControllerInputDto {}

export interface TicTacEventsSearchAllControllerOutputDto {
  events: TicTacEventPrimitives[];
}

@injectable()
export class TicTacEventsSearchAllController extends ControllerBase<TicTacEventsSearchAllControllerOutputDto> {
  constructor(@inject(TicTacEventsAllSearcher) private readonly ticTacEventsAllSearcher: TicTacEventsAllSearcher) {
    super();
  }

  public async _handle(req: Request): Promise<Response<TicTacEventsSearchAllControllerOutputDto | Error>> {
    const events = await this.ticTacEventsAllSearcher.execute();
    return {
      status: 200,
      body: { events },
    };
  }
}
