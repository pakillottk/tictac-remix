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

import { TicketTypePrimitives } from '@tictac/tictac/src/ticket-types/domain/ticket-type';

export function DeleteTicketTypeDialog({
  ticketType,
  children,
}: {
  ticketType: TicketTypePrimitives;
  children: React.ReactNode;
}) {
  const fetcher = useFetcher();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar tipo de entrada</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar el tipo de entrada: {ticketType.name}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              fetcher.submit(
                {},
                {
                  action: `/events/${ticketType.eventId}/ticket-types/${ticketType.ticketTypeId}`,
                  method: 'DELETE',
                }
              );
            }}
          >
            Eliminar
          </AlertDialogAction>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
