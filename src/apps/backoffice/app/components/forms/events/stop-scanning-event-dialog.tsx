import { useFetcher } from '@remix-run/react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { TicTacEventPrimitives } from '@tictac/tictac/src/events/domain/tictac-event';

export function StopScanningEventDialog({
  event,
  children,
}: {
  event: TicTacEventPrimitives;
  children: React.ReactNode;
}) {
  const fetcher = useFetcher();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detener escaneo</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas detener el escaneo del evento: {event.name}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              fetcher.submit(
                {},
                {
                  action: `/events/${event.eventId}/scanning-stop`,
                  method: 'POST',
                }
              );
            }}
          >
            Detener
          </AlertDialogAction>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
