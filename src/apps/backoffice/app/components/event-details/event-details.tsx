import { Card, CardContent } from '@/components/ui/card';
import { TicTacEventPrimitives } from '@tictac/tictac/src/events/domain/tictac-event';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';

export function EventDetails({ event }: { event: TicTacEventPrimitives }) {
  return (
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

          <iframe
            src={`https://maps.google.com/maps?q=${event.eventLocation}&output=embed`}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </CardContent>
    </Card>
  );
}
