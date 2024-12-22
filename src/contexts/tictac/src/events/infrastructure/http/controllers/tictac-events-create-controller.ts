import { ControllerBase } from '@tictac/kernel/src/domain/http/controller-base';
import { Request } from '@tictac/kernel/src/domain/http/request';
import { Response } from '@tictac/kernel/src/domain/http/response';
import { TicTacEventCreator } from '../../../application/create/tictac-event-creator';
import { HttpMethod } from '@tictac/kernel/src/domain/http/http-method';

import { z } from 'zod';
import { inject, injectable } from 'inversify';

export const CreateEventFormDtoSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre del evento debe tener al menos 2 caracteres.',
  }),
  location: z.string().min(2, {
    message: 'La localización del evento debe tener al menos 2 caracteres.',
  }),
  date: z.date().default(new Date()),
  image: z.string(),
  scanning: z.boolean().default(false),
});
export type CreateEventFormInputDto = z.infer<typeof CreateEventFormDtoSchema>;

export interface CreateEventResponseDto {
  message: string;
}

@injectable()
export class TicTacEventsCreateController extends ControllerBase<CreateEventResponseDto> {
  constructor(@inject(TicTacEventCreator) private readonly eventCreator: TicTacEventCreator) {
    super();
  }

  protected async _handle(req: Request): Promise<Response<CreateEventResponseDto | Error>> {
    if (req.method !== HttpMethod.POST) {
      return {
        status: 405,
        body: {
          message: 'Method not allowed',
        },
      };
    }
    const payload = CreateEventFormDtoSchema.parse(req.body);

    await this.eventCreator.execute({
      ...payload,
      eventId: crypto.randomUUID().toString(),
      description: 'Dummy description',
      eventLocation: payload.location,
      eventDate: payload.date,
      ownerId: crypto.randomUUID().toString(),
      ownerName: 'Dummy owner',
      eventImage: payload.image,
    });

    return {
      status: 201,
      body: {
        message: 'Event created successfully',
      },
    };
  }
}
