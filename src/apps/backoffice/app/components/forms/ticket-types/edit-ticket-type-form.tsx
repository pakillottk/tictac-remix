import { useRef } from 'react';
import { useFetcher, useLocation } from '@remix-run/react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TicTacEventPrimitives } from '@tictac/tictac/src/events/domain/tictac-event';
import { TicketTypePrimitives } from '@tictac/tictac/src/ticket-types/domain/ticket-type';

export const EditTicketTypeFormDtoSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre del tipo de entrada debe tener al menos 2 caracteres.',
  }),
  price: z.coerce.number().min(0, {
    message: 'El precio de la entrada debe ser mayor o igual a 0.',
  }),
});

export type EditTicketTypeFormDto = z.infer<typeof EditTicketTypeFormDtoSchema>;

export default function EditTicketTypeForm({
  ticketType,
  onFormSubmitted,
}: {
  ticketType: TicketTypePrimitives;
  onFormSubmitted?: (values?: EditTicketTypeFormDto | null) => void;
}) {
  const { pathname } = useLocation();
  const fetcher = useFetcher();

  const formRef = useRef(null);

  const form = useForm<EditTicketTypeFormDto>({
    resolver: zodResolver(EditTicketTypeFormDtoSchema),
    defaultValues: {
      name: ticketType.name,
      price: ticketType.price,
    },
  });

  async function onSubmit(values: EditTicketTypeFormDto) {
    try {
      fetcher.submit(formRef.current, {
        method: 'PATCH',
        action: pathname + '/ticket-types/' + ticketType.ticketTypeId,
      });

      if (onFormSubmitted != null) {
        onFormSubmitted(values);
      }
    } catch (error) {
      // TODO(pgm) Proper error handling
      console.error(error);
      if (onFormSubmitted != null) {
        onFormSubmitted(null);
      }
    }

    form.reset();
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Editar tipo de entrada</CardTitle>
        <CardDescription>Editar el tipo de entrada</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form ref={formRef} className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduzca nombre del tipo de entrada" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Guardar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
