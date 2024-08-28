import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FilePenIcon, PlusIcon, TrashIcon } from 'lucide-react';

import { DeleteTicketTypeDialog } from '../forms/ticket-types/delete-ticket-type-dialog';
import EditTicketTypeDialog from '../forms/ticket-types/edit-ticket-type-dialog';
import CreateTicketTypeDialog from '../forms/ticket-types/create-ticket-type-dialog';

import { TicketTypePrimitives } from '@tictac/tictac/src/ticket-types/domain/ticket-type';

export default function TicketTypesTable({
  ticketTypes,
  readOnly,
}: {
  ticketTypes: TicketTypePrimitives[];
  readOnly?: boolean;
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Entrada</CardTitle>
          <CardDescription>Gestionar los tipos de entrada.</CardDescription>
          <div className="flex justify-end">
            <CreateTicketTypeDialog>
              <Button disabled={readOnly}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Nuevo
              </Button>
            </CreateTicketTypeDialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="text-xs sm:text-base">
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Escaneado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ticketTypes.map((ticket) => (
                <TableRow key={ticket.ticketTypeId}>
                  <TableCell className="font-medium">{ticket.name}</TableCell>
                  <TableCell>
                    {ticket.scannedAmmount} / {ticket.ammount}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <EditTicketTypeDialog ticketType={ticket}>
                      <Button disabled={readOnly} variant="outline" size="icon">
                        <FilePenIcon className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </EditTicketTypeDialog>

                    <DeleteTicketTypeDialog ticketType={ticket}>
                      <Button disabled={readOnly} variant="outline" size="icon" className="text-red-500">
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </DeleteTicketTypeDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>{ticketTypes.length} tipos</TableCell>
                <TableCell colSpan={2}>
                  {ticketTypes.reduce((acc, ticket) => acc + ticket.scannedAmmount, 0)} /{' '}
                  {ticketTypes.reduce((acc, ticket) => acc + ticket.ammount, 0)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter className="justify-end"></CardFooter>
      </Card>
    </>
  );
}
