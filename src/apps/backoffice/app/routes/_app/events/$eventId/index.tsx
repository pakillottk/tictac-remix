import { json, LoaderFunctionArgs } from '@remix-run/node';

import { CalendarIcon, ClockIcon, FilePenIcon, MapPinIcon, TrashIcon, UsersIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { TictacEventFinder } from '@tictac/tictac/src/events/application/find/tictac-event-finder';
import { MetaFunction, useLoaderData } from '@remix-run/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import CreateTicketTypeDialog from '~/components/forms/ticket-types/create-ticket-type-dialog';

import { container } from '~/container';
import assert from 'assert';
import { TicketTypesByEventFinder } from '@tictac/tictac/src/ticket-types/application/find-by-event/ticket-types-by-event-finder';
import EditTicketTypeDialog from '~/components/forms/ticket-types/edit-ticket-type-dialog';
import { DeleteTicketTypeDialog } from '~/components/forms/ticket-types/delete-ticket-type-dialog';

export async function loader({ params }: LoaderFunctionArgs) {
  const eventFinder = container.get<TictacEventFinder>(TictacEventFinder);
  assert(!!eventFinder);

  const ticketTypesFinder = container.get<TicketTypesByEventFinder>(TicketTypesByEventFinder);
  assert(!!ticketTypesFinder);

  const event = await eventFinder.execute(params.eventId ?? '');
  const ticketTypes = await ticketTypesFinder.execute(params.eventId ?? '');
  return json({ event, ticketTypes });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: 'TIC/TAC Remix - ' + data?.event.name }];
};

export default function TicTacEventPage() {
  const { event: eventJson, ticketTypes } = useLoaderData<typeof loader>();
  const event = { ...eventJson, eventDate: new Date(eventJson.eventDate) };

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <img
            src={event.eventImage ?? ''}
            alt={`${event.name}`}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
          />
          <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
          <div className="flex items-center mb-4">
            <Badge variant={event.scanning ? 'default' : 'secondary'} className="mr-2">
              {event.scanning ? 'Escaneando' : 'Inactivo'}
            </Badge>
            <span className="text-sm text-muted-foreground">Organizado por {event.ownerName}</span>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Entrada</CardTitle>
                <CardDescription>Gestionar los tipos de entrada.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ticketTypes.map((ticket) => (
                      <TableRow key={ticket.ticketTypeId}>
                        <TableCell className="font-medium">{ticket.name}</TableCell>
                        <TableCell>${ticket.price.toFixed(2)}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <EditTicketTypeDialog ticketType={ticket}>
                            <Button variant="outline" size="icon">
                              <FilePenIcon className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                          </EditTicketTypeDialog>
                          <DeleteTicketTypeDialog ticketType={ticket}>
                            <Button variant="outline" size="icon" className="text-red-500">
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </DeleteTicketTypeDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-end">
                <CreateTicketTypeDialog />
              </CardFooter>
            </Card>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Detalles</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  <span>{event.eventDate.toDateString()}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-2 h-5 w-5" />
                  <span>{event.eventDate.getHours()}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="mr-2 h-5 w-5" />
                  <span>{event.eventLocation}</span>
                </div>
                <div className="flex items-center">
                  <UsersIcon className="mr-2 h-5 w-5" />
                  <span>Aforo: 5000 personas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
