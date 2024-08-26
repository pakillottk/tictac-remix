import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { TicTacEventPrimitives } from '@tictac/tictac/src/events/domain/tictac-event';

export function EventCard({ event }: { event: TicTacEventPrimitives }) {
  return (
    <Card className="overflow-hidden">
      <img src={event.eventImage ?? ''} alt={`${event.name}`} className="w-full h-48 object-cover" />
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{event.name}</span>
          <Badge variant={event.scanning ? 'default' : 'secondary'}>{event.scanning ? 'Escaneando' : 'Inactivo'}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <Calendar className="mr-2 h-4 w-4 opacity-70" />
          <span className="text-sm">{event.eventDate.toDateString()}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 opacity-70" />
          <span className="text-sm">{event.eventLocation}</span>
        </div>
      </CardContent>
      <CardFooter>
        <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md transition-colors">
          Detalles
        </button>
      </CardFooter>
    </Card>
  );
}
