import { httpMethodFromString } from '@tictac/kernel/src/domain/http/http-method';
import { Request as TictacRequest } from '@tictac/kernel/src/domain/http/request';

async function parseFormData(request: Request): Promise<Record<string, any>> {
  const body = await request.formData();
  return Object.fromEntries(body.entries());
}

export async function mapRemixRequest(remixRequest: Request, meta: Record<string, any> = {}): Promise<TictacRequest> {
  const headerValues = Object.fromEntries(remixRequest.headers.entries());
  const headers = new Headers(headerValues);

  return {
    headers,
    body: remixRequest.body ? await parseFormData(remixRequest) : {},
    method: httpMethodFromString(remixRequest.method),
    url: remixRequest.url,
    meta,
  };
}
