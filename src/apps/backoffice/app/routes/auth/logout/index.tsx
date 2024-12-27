import * as client from 'openid-client';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { destroySession, getSession } from '~/services/session.server';
import { config } from '~/services/oidc-config.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('tokens')) {
    return redirect('/auth/login', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }

  const logoutUrl = await client.buildEndSessionUrl(config, {
    post_logout_redirect_uri: 'http://localhost:5173/auth/logout/end',
  });

  return redirect(logoutUrl.toString());
}
