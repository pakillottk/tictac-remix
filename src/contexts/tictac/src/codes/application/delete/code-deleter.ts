import { inject, injectable } from 'inversify';

import { CodesRepository } from '../../domain/codes-repository';
import { TicketCode } from '../../domain/ticket-code';
import { EventBus } from '@tictac/kernel/src/domain/event-bus';

@injectable()
export class CodeDeleter {
  constructor(
    @inject(EventBus) private readonly eventBus: EventBus,
    @inject(CodesRepository) private readonly codesRepository: CodesRepository
  ) {}

  async execute(code: string) {
    const ticketCode = new TicketCode(code);
    const codeFound = await this.codesRepository.findByCode(ticketCode);
    if (!codeFound) {
      throw new Error('Code ' + code + ' not found');
    }

    if (codeFound.isScanned) {
      throw new Error('Code ' + code + ' is already scanned');
    }

    codeFound.delete();
    await this.codesRepository.delete(ticketCode);

    await this.eventBus.publish(codeFound.pullDomainEvents());
  }
}
