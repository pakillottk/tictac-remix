import { ActionFunctionArgs, json } from '@remix-run/node';
import { TicketTypeEditor } from '@tictac/tictac/src/ticket-types/application/edit/ticket-type-editor';
import { EditTicketTypeFormDtoSchema } from '~/components/forms/ticket-types/edit-ticket-type-form';
import { container } from '~/container';

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'PATCH') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { ticketTypeId } = params;
  if (!ticketTypeId) {
    return json({ error: 'Ticket type ID is required' }, { status: 400 });
  }

  const form = await request.formData();
  const payload = EditTicketTypeFormDtoSchema.parse(Object.fromEntries(form));

  const ticketTypeEditor = container.get<TicketTypeEditor>(TicketTypeEditor);
  await ticketTypeEditor.execute({ ticketTypeId, ...payload });

  return json({ message: 'Ticket type updated' });
}
