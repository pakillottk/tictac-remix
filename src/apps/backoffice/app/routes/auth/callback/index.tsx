import * as client from 'openid-client';
import { config } from '~/services/oidc-config.server';
import * as jwt from 'jsonwebtoken';

import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { commitSession, getSession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const code_verifier = session.get('code_verifier');
  const state = session.get('state');

  const tokens: client.TokenEndpointResponse = await client.authorizationCodeGrant(config, new URL(request.url), {
    pkceCodeVerifier: code_verifier,
    expectedState: state,
  });

  const decodedToken = jwt.decode(tokens.access_token) as any;
  const userInfo = {
    userId: decodedToken.sub,
    email: decodedToken.email,
    name: decodedToken.name,
    roles: decodedToken.realm_access.roles,
  };

  if (tokens.token_type.toLowerCase() !== 'bearer') {
    throw new Error('Invalid token type');
  }

  const tokenExpirationDate = new Date();
  tokenExpirationDate.setSeconds(tokenExpirationDate.getSeconds() + (tokens.expires_in || 0));

  session.set('user', userInfo);
  session.set('tokens', {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expiresAt: tokenExpirationDate,
  });
  session.unset('code_verifier');
  session.unset('state');

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}
