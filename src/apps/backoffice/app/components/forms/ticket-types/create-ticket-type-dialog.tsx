import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateTicketTypeForm from './create-ticket-type-form';

export default function CreateTicketTypeDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nuevo tipo de entrada
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo tipo de entrada</DialogTitle>
        </DialogHeader>
        <CreateTicketTypeForm
          onFormSubmitted={(values) => {
            setIsDialogOpen(false);
            // TODO: Check errors
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
