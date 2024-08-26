import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import EditTicketTypeForm from './edit-ticket-type-form';
import { TicketTypePrimitives } from '@tictac/tictac/src/ticket-types/domain/ticket-type';

export default function EditTicketTypeDialog({
  ticketType,
  children,
}: {
  ticketType: TicketTypePrimitives;
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar tipo de entrada</DialogTitle>
          <DialogDescription>Modifica los datos del tipo de entrada.</DialogDescription>
        </DialogHeader>
        <EditTicketTypeForm
          ticketType={ticketType}
          onFormSubmitted={(values) => {
            setIsDialogOpen(false);
            // TODO: Check errors
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
