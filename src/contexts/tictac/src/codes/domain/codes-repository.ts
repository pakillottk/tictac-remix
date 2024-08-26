import { TicketTypeId } from '../../kernel/domain/ticket-type-id';
import { Code } from './code';
import { Option } from 'fp-ts/lib/Option';
import { TicketCode } from './ticket-code';

export abstract class CodesRepository {
  abstract save(code: Code): Promise<void>;
  abstract bulkCreate(codes: Code[]): Promise<void>;
  abstract bulkUpdate(codes: Code[]): Promise<void>;

  abstract findByCode(code: TicketCode): Promise<Option<Code>>;

  abstract findByTicketTypeId(ticketTypeId: TicketTypeId): Promise<Code[]>;
  abstract findByTicketTypesIds(
    ticketTypeIds: TicketTypeId[],
    limit: number,
    offset: number
  ): Promise<{ codes: Code[]; count: number }>;

  abstract countByTicketTypeId(ticketId: TicketTypeId): Promise<number>;

  abstract findAll(): Promise<Code[]>;
}
