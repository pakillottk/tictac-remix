import { InvalidArgumentError } from '../value-object/invalid-argument-error';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
}

export function httpMethodFromString(method: string): HttpMethod {
  switch (method) {
    case 'GET':
      return HttpMethod.GET;
    case 'POST':
      return HttpMethod.POST;
    case 'PUT':
      return HttpMethod.PUT;
    case 'DELETE':
      return HttpMethod.DELETE;
    case 'PATCH':
      return HttpMethod.PATCH;
    case 'OPTIONS':
      return HttpMethod.OPTIONS;
    case 'HEAD':
      return HttpMethod.HEAD;
    default:
      throw new InvalidArgumentError(`Invalid HTTP method: ${method}`);
  }
}
