import { EventBus } from '@tictac/kernel/src/domain/event-bus';
import { inject, injectable } from 'inversify';
import { CodesRepository } from '../../domain/codes-repository';
import { TicketCode } from '../../domain/ticket-code';
import { CodeScannedBy } from '../../domain/code-scanned-by';
import { QueryBus } from '@tictac/kernel/src/domain/query-bus';
import {
  EventBasicInfoQuery,
  EventBasicInfoQueryResponse,
} from '@tictac/tictac/src/kernel/domain/queries/event-basic-info-query';

export interface CodeScannerParameters {
  eventId: string;
  ticketCode: string;
  scannedBy: {
    id: string;
    name: string;
  };
}

@injectable()
export class CodeScanner {
  constructor(
    @inject(QueryBus) private readonly queryBus: QueryBus,
    @inject(EventBus) private readonly eventBus: EventBus,
    @inject(CodesRepository) private readonly codesRepository: CodesRepository
  ) {}

  async execute(parameters: CodeScannerParameters): Promise<void> {
    const eventInfo = await this.queryBus.ask<EventBasicInfoQueryResponse>(new EventBasicInfoQuery(parameters.eventId));
    if (!eventInfo.scanning) {
      // TODO: Use a custom error
      throw new Error('Event is not in scanning mode');
    }

    const code = await this.codesRepository.findByCode(new TicketCode(parameters.ticketCode));
    if (!code) {
      throw new Error('Code ' + parameters.ticketCode + ' not found');
    }

    const scannedCode = code.scan(CodeScannedBy.fromPrimitives(parameters.scannedBy));
    await this.codesRepository.save(scannedCode);

    this.eventBus.publish(scannedCode.pullDomainEvents());
  }
}
