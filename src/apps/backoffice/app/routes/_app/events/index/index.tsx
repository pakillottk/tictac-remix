import { container } from '~/container';
import assert from 'assert';
import { json, Link, useLoaderData } from '@remix-run/react';
import { EventCard } from '~/components/event-card/event-card';
import { TicTacEventsAllSearcher } from '@tictac/tictac/src/events/application/search-all/tictac-events-all-searcher';
import CreateEventDialog from '~/components/forms/events/create-event-dialog';
import { ActionFunctionArgs } from '@remix-run/node';
import { TicTacEventCreator } from '@tictac/tictac/src/events/application/create/tictac-event-creator';
import { CreateEventFormDtoSchema } from '~/components/forms/events/create-event-form';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export async function loader() {
  const searcher = container.get<TicTacEventsAllSearcher>(TicTacEventsAllSearcher);
  assert(!!searcher);
  const events = await searcher.execute();
  return json({ events });
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

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ message: 'Method not allowed' }, { status: 405 });
  }

  const eventCreator = container.get<TicTacEventCreator>(TicTacEventCreator);
  assert(!!eventCreator);

  const body = await request.formData();
  const payload = CreateEventFormDtoSchema.parse(Object.fromEntries(body.entries()));

  await eventCreator.execute({
    ...payload,
    eventId: crypto.randomUUID().toString(),
    description: 'Dummy description',
    eventLocation: payload.location,
    eventDate: payload.date,
    ownerId: crypto.randomUUID().toString(),
    ownerName: 'Dummy owner',
    eventImage: payload.image,
  });

  return json({ message: 'Event created' }, { status: 201 });
}
