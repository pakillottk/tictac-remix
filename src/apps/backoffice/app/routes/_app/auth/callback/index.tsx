import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/authenticator.server';

export function loader({ request }: LoaderFunctionArgs) {
  return authenticator.authenticate('keycloak', request, {
    successRedirect: '/',
    failureRedirect: '/auth/login',
  });
}
