import assert from 'assert';
import { interfaces } from 'inversify';

import { container } from '~/container';
import { mapRemixRequest } from './remix-request-mapper';
import { ControllerBase } from '@tictac/kernel/src/domain/http/controller-base';
import { Response } from '@tictac/kernel/src/domain/http/response';

export async function remixRequestHandler<TController extends ControllerBase<TResponse>, TResponse>(
  controllerIdentifier: interfaces.ServiceIdentifier<TController>,
  request: Request
) {
  const controller = container.get<TController>(controllerIdentifier);
  assert(!!controller);
  const mappedRequest = await mapRemixRequest(request);

  const responseBuilder = async (): Promise<Response<TResponse>> => {
    const response = await controller.handle(mappedRequest);
    if (response.body instanceof Error) {
      throw response.body;
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: response.body,
    };
  };

  return await responseBuilder();
}
