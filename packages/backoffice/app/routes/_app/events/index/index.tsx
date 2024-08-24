import { container } from '~/container';
import assert from 'assert';
import { json, Link, useLoaderData } from '@remix-run/react';
import { EventCard } from '~/components/event-card/event-card';
import { TicTacEventsAllSearcher } from '@tictac/tictac/src/events/application/search-all/tictac-events-all-searcher';

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
      <header className="flex justify-between items-center sticky bg-back mb-2">
        <h1 className="text-3xl font-bold">Eventos</h1>
        {/* <CreateEventDialog /> */}
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
