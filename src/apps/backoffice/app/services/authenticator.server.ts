import { Authenticator } from 'remix-auth';
import { KeycloakStrategy } from 'remix-keycloak';
import { sessionStorage } from './session.server';

export const authenticator = new Authenticator(sessionStorage);

const keycloakStrategy = new KeycloakStrategy(
  {
    useSSL: false,
    domain: 'localhost:8080',
    realm: 'tictac',
    clientID: 'tictac-backoffice',
    clientSecret: 'jFpohfghtm29Wnt7osY3FBYAmf1ClPqx',
    callbackURL: 'http://localhost:5173/auth/callback',
  },
  async ({ profile }) => profile
);

authenticator.use(keycloakStrategy);
