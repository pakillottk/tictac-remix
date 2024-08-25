import { CalendarIcon, ClockIcon, MapPinIcon, TicketIcon, UsersIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';

import { container } from '~/container';
import assert from 'assert';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { TictacEventFinder } from '@tictac/tictac/src/events/application/find/tictac-event-finder';
import { useLoaderData } from '@remix-run/react';
import { TicketTypesByEventFinder } from '@tictac/tictac/src/ticket-types/application/find-by-event/ticket-types-by-event-finder';

export async function loader({ params }: LoaderFunctionArgs) {
  const eventFinder = container.get<TictacEventFinder>(TictacEventFinder);
  assert(!!eventFinder);

  const ticketTypesFinder = container.get<TicketTypesByEventFinder>(TicketTypesByEventFinder);
  assert(!!ticketTypesFinder);

  const event = await eventFinder.execute(params.eventId ?? '');
  const ticketTypes = await ticketTypesFinder.execute(params.eventId ?? '');
  return json({ event, ticketTypes });
}

export default function TicTacEventPage() {
  const { event: eventJson, ticketTypes } = useLoaderData<typeof loader>();
  const event = { ...eventJson, eventDate: new Date(eventJson.eventDate) };

  return (
    <>
      {/* <div className="flex justify-end items-center mb-6">
        <div className="space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <TrashIcon className="mr-2 h-4 w-4" />
                Borrar evento
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Seguro que desea eliminar el evento?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Todos los datos relacionados con el evento se perderán.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div> */}

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

          <h2 className="text-2xl font-semibold mb-4">Tipos de entrada</h2>
          <div className="space-y-4">
            {ticketTypes.map((ticket, index) => (
              <Card key={index}>
                <CardContent className="flex justify-between items-center p-4">
                  <div className="flex items-center">
                    <TicketIcon className="mr-2 h-5 w-5" />
                    <span>{ticket.name}</span>
                  </div>
                  <span className="font-semibold">${ticket.price}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Detalles</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  <span>{event.eventDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-2 h-5 w-5" />
                  <span>{event.eventDate.toTimeString()}</span>
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
