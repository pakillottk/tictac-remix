import { json, Link, useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { remixRequestHandler } from '@/lib/remix-request-handler';

import { EventCard } from '~/components/event-card/event-card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

import CreateEventDialog from '~/components/forms/events/create-event-dialog';
import {
  TicTacEventsSearchAllController,
  TicTacEventsSearchAllControllerOutputDto,
} from '@tictac/tictac/src/events/infrastructure/http/controllers/tictac-events-search-all-controller';

import {
  CreateEventResponseDto,
  TicTacEventsCreateController,
} from '@tictac/tictac/src/events/infrastructure/http/controllers/tictac-events-create-controller';

export async function loader({ request }: LoaderFunctionArgs) {
  const response = await remixRequestHandler<TicTacEventsSearchAllController, TicTacEventsSearchAllControllerOutputDto>(
    TicTacEventsSearchAllController,
    request
  );

  return response.body;
}

export default function Events() {
  const { events } = useLoaderData<typeof loader>();
  return (
    <>
      <header className="flex justify-between items-center sticky top-16 z-10 p-4 bg-background mb-2">
        <h1 className="text-3xl font-bold">Eventos</h1>
        <CreateEventDialog>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nuevo
          </Button>
        </CreateEventDialog>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0
          ? 'Aún no hay eventos...'
          : events.map((event) => (
              <Link
                className="transition-transform hover:scale-[1.015]"
                to={`/events/${event.eventId}`}
                key={event.eventId}
              >
                <EventCard key={event.eventId} event={{ ...event, eventDate: new Date(event.eventDate) }} />
              </Link>
            ))}
      </section>
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const response = await remixRequestHandler<TicTacEventsCreateController, CreateEventResponseDto>(
    TicTacEventsCreateController,
    request
  );

  return json(response.body, { status: response.status });
}
