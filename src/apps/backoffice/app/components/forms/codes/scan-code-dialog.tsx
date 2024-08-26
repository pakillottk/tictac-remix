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
import { useFetcher } from '@remix-run/react';
import { CodePrimitives } from '@tictac/tictac/src/codes/domain/code';

export function ScanCodeDialog({ code, children }: { code: CodePrimitives; children: React.ReactNode }) {
  const fetcher = useFetcher();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Escanear código</AlertDialogTitle>
          <AlertDialogDescription>¿Estás seguro de que deseas escanear el código: {code.code}?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              fetcher.submit(
                {},
                {
                  action: `/events/${code.eventId}/codes/${code.code}/scan`,
                  method: 'POST',
                }
              );
            }}
          >
            Escanear
          </AlertDialogAction>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
