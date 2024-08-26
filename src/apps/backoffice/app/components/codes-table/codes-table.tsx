import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CodePrimitives } from '@tictac/tictac/src/codes/domain/code';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { ImportCodesDialog } from '../forms/codes/import-codes-dialog';
import { DeleteCodeDialog } from '../forms/codes/delete-code-dialog';

export function CodesTable({
  codes,
  readOnly,
  header,
  footer,
}: {
  codes: CodePrimitives[];
  readOnly?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Códigos</CardTitle>
        <CardDescription>Gestión de códigos de acceso</CardDescription>
        {header}
      </CardHeader>
      <CardContent>
        <Table className="text-xs sm:text-base">
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Escaneado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.map((code) => (
              <TableRow key={code.code}>
                <TableCell>{code.ticketType.name}</TableCell>
                <TableCell className="font-medium">{code.code}</TableCell>
                <TableCell>
                  {code.scannedAt
                    ? new Date(code.scannedAt).toDateString() + ` (${code.scannedBy?.name})`
                    : 'No escaneado'}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <DeleteCodeDialog code={code}>
                    <Button disabled={readOnly} variant="outline" size="icon" className="text-red-500">
                      <TrashIcon className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </DeleteCodeDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {footer && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  {footer}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}
