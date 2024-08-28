import { ActionFunctionArgs, json } from '@remix-run/node';

import { CreateTicketTypeFormDtoSchema } from '~/components/forms/ticket-types/create-ticket-type-form';

import { container } from '~/container';
import { TicketTypeCreator } from '@tictac/tictac/src/ticket-types/application/create/ticket-type-creator';
import assert from 'assert';

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  if (!params.eventId) {
    return json({ error: 'Event ID is required' }, { status: 400 });
  }

  const ticketCreator = container.get<TicketTypeCreator>(TicketTypeCreator);
  assert(!!ticketCreator);

  const form = await request.formData();
  const payload = CreateTicketTypeFormDtoSchema.parse(Object.fromEntries(form));

  await ticketCreator.execute({
    ...payload,
    ticketTypeId: crypto.randomUUID().toString(),
    eventId: params.eventId,
  });

  return json({ message: 'Ticket type created successfully' }, { status: 201 });
}
