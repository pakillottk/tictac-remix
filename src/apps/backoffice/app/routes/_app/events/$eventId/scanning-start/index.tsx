import { json, LoaderFunctionArgs } from '@remix-run/node';
import { TicTacEventScanningStarter } from '@tictac/tictac/src/events/application/start-scanning/tictac-event-scanning-starter';

import { container } from '~/container';
import assert from 'assert';

export async function action({ request, params }: LoaderFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { eventId } = params;
  if (!eventId) {
    return json({ message: 'Event ID is required' }, { status: 400 });
  }

  const eventScanningStarter = container.get<TicTacEventScanningStarter>(TicTacEventScanningStarter);
  assert(!!eventScanningStarter);

  try {
    await eventScanningStarter.execute(eventId);
    return json({ message: 'Event scanning started' }, { status: 200 });
  } catch (error) {
    return json({ message: (error as Error).message }, { status: 400 });
  }
}
