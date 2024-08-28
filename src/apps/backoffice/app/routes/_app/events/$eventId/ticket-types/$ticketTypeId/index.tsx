import { ActionFunctionArgs, json } from '@remix-run/node';

import { EditTicketTypeFormDtoSchema } from '~/components/forms/ticket-types/edit-ticket-type-form';

import { TicketTypeDeleter } from '@tictac/tictac/src/ticket-types/application/delete/ticket-type-deleter';
import { TicketTypeEditor } from '@tictac/tictac/src/ticket-types/application/edit/ticket-type-editor';

import { container } from '~/container';
import assert from 'assert';

export async function action({ request, params }: ActionFunctionArgs) {
  const { ticketTypeId } = params;
  if (!ticketTypeId) {
    return json({ error: 'Ticket type ID is required' }, { status: 400 });
  }

  if (request.method === 'PATCH') {
    const form = await request.formData();
    const payload = EditTicketTypeFormDtoSchema.parse(Object.fromEntries(form));

    const ticketTypeEditor = container.get<TicketTypeEditor>(TicketTypeEditor);
    assert(!!ticketTypeEditor);
    await ticketTypeEditor.execute({ ticketTypeId, ...payload });

    return json({ message: 'Ticket type updated' });
  } else if (request.method === 'DELETE') {
    const ticketTypeDeleter = container.get<TicketTypeDeleter>(TicketTypeDeleter);
    assert(!!ticketTypeDeleter);
    await ticketTypeDeleter.execute(ticketTypeId);
    return json({ message: 'Ticket type deleted' }, { status: 200 });
  }

  return json({ error: 'Method not allowed' }, { status: 405 });
}
