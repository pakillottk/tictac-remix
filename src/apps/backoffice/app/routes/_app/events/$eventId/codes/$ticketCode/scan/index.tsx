import { ActionFunctionArgs, json } from '@remix-run/node';
import { CodeScanner } from '@tictac/tictac/src/codes/application/scan/code-scanner';

import { container } from '~/container';
import assert from 'assert';

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { eventId, ticketCode } = params;
  if (!eventId) {
    return json({ error: 'Event ID is required' }, { status: 400 });
  }

  if (!ticketCode) {
    return json({ error: 'Ticket code is required' }, { status: 400 });
  }

  const codeScanner = container.get<CodeScanner>(CodeScanner);
  assert(!!codeScanner);

  const scannedBy = {
    id: crypto.randomUUID().toString(),
    name: 'Test User',
  };

  try {
    await codeScanner.execute({ eventId, ticketCode, scannedBy });

    return json({ message: 'Code scanned' }, { status: 200 });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
}
