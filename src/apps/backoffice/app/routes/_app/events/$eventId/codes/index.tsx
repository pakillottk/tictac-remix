import { ActionFunctionArgs, json } from '@remix-run/node';

import { TicketTypesByEventFinder } from '@tictac/tictac/src/ticket-types/application/find-by-event/ticket-types-by-event-finder';

import { TicketTypeCreator } from '@tictac/tictac/src/ticket-types/application/create/ticket-type-creator';
import { BulkCodeCreator } from '@tictac/tictac/src/codes/application/bulk-create/bulk-code-creator';

import { container } from '~/container';
import assert from 'assert';

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  if (!params.eventId) {
    return json({ error: 'Event ID is required' }, { status: 400 });
  }

  const form = await request.formData();
  const parsedCodes = JSON.parse(form.get('parsed-codes') as string) as { type: string; code: string }[];

  const ticketTypeFinder = container.get<TicketTypesByEventFinder>(TicketTypesByEventFinder);
  assert(!!ticketTypeFinder);

  const ticketTypeCreator = container.get<TicketTypeCreator>(TicketTypeCreator);
  assert(!!ticketTypeCreator);

  const bukCodeCreator = container.get<BulkCodeCreator>(BulkCodeCreator);
  assert(!!bukCodeCreator);

  const ticketTypes = await ticketTypeFinder.execute(params.eventId);

  // Create the missing ticket types
  const ticketTypesInParsedCodes = Array.from(new Set(parsedCodes.map((code) => code.type)).values());
  const missingTicketTypes = ticketTypesInParsedCodes.filter(
    (type) => !ticketTypes.find((ticketType) => ticketType.name.toLowerCase() === type.toLowerCase())
  );
  for (const ticketType of missingTicketTypes) {
    const newTicketType = {
      ticketTypeId: crypto.randomUUID().toString(),
      name: ticketType,
      eventId: params.eventId,
      ammount: 0,
      scannedAmmount: 0,
    };
    await ticketTypeCreator.execute(newTicketType);
    ticketTypes.push(newTicketType);
  }

  // Index the ticket types by name
  const ticketTypesByName: Map<string, string> = new Map();
  for (const ticketType of ticketTypes) {
    ticketTypesByName.set(ticketType.name.toLowerCase(), ticketType.ticketTypeId);
  }

  // Create the codes
  await bukCodeCreator.execute(
    parsedCodes.map((code) => ({
      code: code.code,
      ticketTypeId: ticketTypesByName.get(code.type.toLowerCase()) as string,
      ticketTypeName: code.type,
      eventId: params.eventId!,
    }))
  );

  return json({ message: `Imported ${parsedCodes.length} codes` });
}
