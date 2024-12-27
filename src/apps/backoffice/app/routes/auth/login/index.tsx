import * as client from 'openid-client';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { config } from '~/services/oidc-config.server';
import { commitSession, getSession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  /**
   * Value used in the authorization request as the redirect_uri parameter, this
   * is typically pre-registered at the Authorization Server.
   */
  const redirect_uri: string = 'http://localhost:5173/auth/callback';
  const scope: string = 'openid email profile'; // Scope of the access request
  /**
   * PKCE: The following MUST be generated for every redirect to the
   * authorization_endpoint. You must store the code_verifier and state in the
   * end-user session such that it can be recovered as the user gets redirected
   * from the authorization server back to your application.
   */
  const code_verifier: string = client.randomPKCECodeVerifier();
  const code_challenge: string = await client.calculatePKCECodeChallenge(code_verifier);
  let state!: string;

  const parameters: Record<string, string> = {
    redirect_uri,
    scope,
    code_challenge,
    code_challenge_method: 'S256',
  };

  if (!config.serverMetadata().supportsPKCE()) {
    /**
     * We cannot be sure the server supports PKCE so we're going to use state too.
     * Use of PKCE is backwards compatible even if the AS doesn't support it which
     * is why we're using it regardless. Like PKCE, random state must be generated
     * for every redirect to the authorization_endpoint.
     */
    state = client.randomState();
    parameters.state = state;
  }

  const session = await getSession(request.headers.get('Cookie'));
  session.set('code_verifier', code_verifier);
  session.set('state', state);

  const redirectTo: URL = client.buildAuthorizationUrl(config, parameters);
  return redirect(redirectTo.toString(), {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}
