import * as client from 'openid-client';

const keycloakConfig = await client.discovery(
  new URL('http://localhost:8080/realms/tictac'),
  'tictac-backoffice',
  {},
  undefined,
  {
    execute: [client.allowInsecureRequests],
  }
);
export const config = keycloakConfig;
