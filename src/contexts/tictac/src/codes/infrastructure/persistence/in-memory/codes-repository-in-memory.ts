import { fromNullable } from 'fp-ts/lib/Option';

import { TicketTypeId } from '@tictac/tictac/src/kernel/domain/ticket-type-id';
import { Code } from '../../../domain/code';
import { CodesRepository } from '../../../domain/codes-repository';
import { TicketCode } from '../../../domain/ticket-code';

export class CodesRepositoryInMemory extends CodesRepository {
  constructor(private readonly codes: Code[] = []) {
    super();
  }

  async save(code: Code) {
    const idx = this.codes.findIndex((c) => c.code.value === code.code.value);
    if (idx === -1) {
      this.codes.push(code);
    } else {
      this.codes[idx] = code;
    }
  }

  async bulkCreate(codes: Code[]): Promise<void> {
    this.codes.push(...codes);
  }

  async bulkUpdate(codes: Code[]): Promise<void> {
    codes.forEach((code) => {
      const idx = this.codes.findIndex((c) => c.code.value === code.code.value);
      if (idx === -1) {
        this.codes.push(code);
      } else {
        this.codes[idx] = code;
      }
    });
  }

  async findByCode(code: TicketCode) {
    return this.codes.find((c) => c.code.value === code.value) || null;
  }

  async findByTicketTypeId(ticketTypeId: TicketTypeId) {
    return this.codes.filter((c) => c.ticketType.id.value === ticketTypeId.value);
  }

  async findByTicketTypesIds(
    ticketTypeIds: TicketTypeId[],
    limit: number,
    offset: number
  ): Promise<{ codes: Code[]; count: number }> {
    const codes = this.codes.filter((c) => ticketTypeIds.some((t) => t.value === c.ticketType.id.value));

    return {
      count: codes.length,
      codes: codes.slice(offset, offset + limit),
    };
  }

  async countByTicketTypeId(ticketId: TicketTypeId): Promise<number> {
    return this.codes.filter((c) => c.ticketType.id.value === ticketId.value).length;
  }

  async findAll() {
    return this.codes;
  }

  async delete(code: TicketCode): Promise<void> {
    const idx = this.codes.findIndex((c) => c.code.value === code.value);
    if (idx !== -1) {
      this.codes.splice(idx, 1);
    }
  }
}
