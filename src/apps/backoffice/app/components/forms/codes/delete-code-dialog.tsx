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

import { CodePrimitives } from '@tictac/tictac/src/codes/domain/code';

export function DeleteCodeDialog({ code, children }: { code: CodePrimitives; children: React.ReactNode }) {
  const fetcher = useFetcher();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar código</AlertDialogTitle>
          <AlertDialogDescription>¿Estás seguro de que deseas eliminar el código: {code.code}?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              fetcher.submit(
                {},
                {
                  action: `/events/${code.eventId}/codes/${code.code}`,
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
