import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogPortal, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateEventForm } from './create-event-form';
import { DialogDescription } from '@radix-ui/react-dialog';

export default function CreateEventDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nuevo evento
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          // FIXME(pgm): Workaround for the google autocomplete input
          const hasPacItem = e.composedPath().some((el: EventTarget) => {
            if ('classList' in el) {
              return Array.from((el as Element).classList).includes('pac-item');
            }
            return false;
          });

          // if we click an autocomplete item, prevent the default onInteractOutside action, to close
          if (hasPacItem) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Crear nuevo evento</DialogTitle>
          <DialogDescription>Complete el formulario para crear un nuevo evento.</DialogDescription>
        </DialogHeader>
        <CreateEventForm
          onFormSubmitted={(values) => {
            setIsDialogOpen(false);
            // TODO: Check errors
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
