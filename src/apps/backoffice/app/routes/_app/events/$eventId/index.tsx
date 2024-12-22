import { json, LoaderFunctionArgs } from '@remix-run/node';
import { Link, MetaFunction, useLoaderData, useSearchParams } from '@remix-run/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImportIcon, SmartphoneIcon } from 'lucide-react';

import TicketTypesTable from '~/components/ticket-types-table/ticket-types-table';
import { CodesTable } from '~/components/codes-table/codes-table';
import { EventDetails } from '~/components/event-details/event-details';
import { ImportCodesDialog } from '~/components/forms/codes/import-codes-dialog';
import { StartScanningEventDialog } from '~/components/forms/events/start-scanning-event-dialog';
import { StopScanningEventDialog } from '~/components/forms/events/stop-scanning-event-dialog';

import { TictacEventFinder } from '@tictac/tictac/src/events/application/find/tictac-event-finder';
import { TicketTypesByEventFinder } from '@tictac/tictac/src/ticket-types/application/find-by-event/ticket-types-by-event-finder';
import { CodesByTicketTypesIdsFinder } from '@tictac/tictac/src/codes/application/find-by-ticket-types-ids/codes-by-ticket-types-ids-finder';

import { container } from '~/container';
import assert from 'assert';

const PAGE_LIMIT = 25;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const eventFinder = container.get<TictacEventFinder>(TictacEventFinder);
  assert(!!eventFinder);

  const ticketTypesFinder = container.get<TicketTypesByEventFinder>(TicketTypesByEventFinder);
  assert(!!ticketTypesFinder);

  const codesFinder = container.get<CodesByTicketTypesIdsFinder>(CodesByTicketTypesIdsFinder);
  assert(!!codesFinder);

  const desiredCodeTicketType = url.searchParams.get('codeTicketType') ?? null;

  const event = await eventFinder.execute(params.eventId ?? '');
  const ticketTypes = await ticketTypesFinder.execute(params.eventId ?? '');
  const paginatedCodes = await codesFinder.execute({
    ticketTypesIds:
      desiredCodeTicketType && desiredCodeTicketType !== '*'
        ? [desiredCodeTicketType]
        : ticketTypes.map((ticketType) => ticketType.ticketTypeId),
    limit: PAGE_LIMIT,
    offset: parseInt(url.searchParams.get('codesPage') ?? '0') * PAGE_LIMIT,
  });
  return json({ event, ticketTypes, paginatedCodes });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: 'TIC/TAC Remix - ' + data?.event.name }];
};

export default function TicTacEventPage() {
  const { event: eventJson, ticketTypes, paginatedCodes } = useLoaderData<typeof loader>();
  const event = { ...eventJson, eventDate: new Date(eventJson.eventDate) };
  const codes = paginatedCodes.codes.map((code) => ({
    ...code,
    scannedAt: code.scannedAt ? new Date(code.scannedAt) : null,
  }));

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <div className="flex flex-col flex-wrap space-y-6 relative">
        <header className="sticky top-16 z-10 bg-background flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
            <div className="flex items-center mb-4">
              <Badge variant={event.scanning ? 'default' : 'secondary'} className="mr-2">
                {event.scanning ? 'Escaneando' : 'Inactivo'}
              </Badge>
              <span className="text-sm text-muted-foreground">Organizado por {event.ownerName}</span>
            </div>
          </div>

          {!event.scanning && (
            <StartScanningEventDialog event={event}>
              <Button color="primary">
                <SmartphoneIcon className="mr-2 h-4 w-4" />
                Escanear
              </Button>
            </StartScanningEventDialog>
          )}

          {event.scanning && (
            <StopScanningEventDialog event={event}>
              <Button color="primary">
                <SmartphoneIcon className="mr-2 h-4 w-4 text-red-500" />
                Detener
              </Button>
            </StopScanningEventDialog>
          )}
        </header>

        {event.eventImage && (
          <img src={event.eventImage} alt={`${event.name}`} className="w-full h-64 md:h-96 object-cover rounded-lg" />
        )}

        <div>
          <EventDetails event={event} />
        </div>

        <div>
          <TicketTypesTable ticketTypes={ticketTypes} readOnly={event.scanning} />
        </div>

        <div className="mt-4">
          <CodesTable
            codes={codes}
            readOnly={event.scanning}
            header={
              <div className="flex flex-wrap items-center justify-between">
                <Select
                  defaultValue="*"
                  onValueChange={(value) => {
                    setSearchParams(
                      { ...searchParams, codesPage: '0', codeTicketType: value },
                      { preventScrollReset: true }
                    );
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">Todos</SelectItem>
                    {ticketTypes.map((ticketType) => (
                      <SelectItem key={ticketType.ticketTypeId} value={ticketType.ticketTypeId}>
                        {ticketType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <ImportCodesDialog>
                  <Button disabled={event.scanning}>
                    <ImportIcon className="mr-2 h-4 w-4" />
                    Importar
                  </Button>
                </ImportCodesDialog>
              </div>
            }
            footer={
              <div className="flex items-center justify-between">
                <div>
                  Página {paginatedCodes.offset / PAGE_LIMIT + 1} de{' '}
                  {Math.ceil((paginatedCodes.total || 1) / PAGE_LIMIT)}
                  {paginatedCodes.total ? (
                    <span className="text-muted-foreground"> ({paginatedCodes.total} códigos)</span>
                  ) : null}
                </div>
                <ul className="flex space-x-2">
                  <li>
                    <Button disabled={paginatedCodes.offset <= 0}>
                      <Link
                        to={{
                          pathname: '.',
                          search: new URLSearchParams({
                            ...Object.fromEntries(searchParams.entries()),
                            codesPage: (paginatedCodes.offset / PAGE_LIMIT - 1).toString(),
                          }).toString(),
                        }}
                        preventScrollReset
                      >
                        Anterior
                      </Link>
                    </Button>
                  </li>
                  <li>
                    <Button disabled={paginatedCodes.offset + paginatedCodes.count >= paginatedCodes.total}>
                      <Link
                        to={{
                          pathname: '.',
                          search: new URLSearchParams({
                            ...Object.fromEntries(searchParams.entries()),
                            codesPage: (paginatedCodes.offset / PAGE_LIMIT + 1).toString(),
                          }).toString(),
                        }}
                        preventScrollReset
                      >
                        Siguiente
                      </Link>
                    </Button>
                  </li>
                </ul>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
}
