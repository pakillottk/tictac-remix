import { HttpMethod } from './http-method';

export interface Request {
  url: string;
  method: HttpMethod;
  headers: Headers;
  body: any | null;
  meta: Record<string, any>;
}
