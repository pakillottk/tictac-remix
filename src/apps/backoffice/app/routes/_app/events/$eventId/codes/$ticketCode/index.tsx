import { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/react';

import { CodeDeleter } from '@tictac/tictac/src/codes/application/delete/code-deleter';

import { container } from '~/container';
import assert from 'assert';

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'DELETE') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  if (!params.ticketCode) {
    return json({ error: 'ticketCode is required' }, { status: 400 });
  }

  const codeDeleter = container.get<CodeDeleter>(CodeDeleter);
  assert(!!codeDeleter);

  await codeDeleter.execute(params.ticketCode);

  return json({ message: 'Code deleted' }, { status: 200 });
}
