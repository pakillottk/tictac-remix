import { json, LoaderFunctionArgs } from '@remix-run/node';
import { TicTacEventScanningStopper } from '@tictac/tictac/src/events/application/stop-scanning/tictac-event-scanning-stopper';

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

  const eventScanningStopper = container.get<TicTacEventScanningStopper>(TicTacEventScanningStopper);
  assert(!!eventScanningStopper);

  try {
    await eventScanningStopper.execute(eventId);
    return json({ message: 'Event scanning stopped' }, { status: 200 });
  } catch (error) {
    return json({ message: (error as Error).message }, { status: 400 });
  }
}
