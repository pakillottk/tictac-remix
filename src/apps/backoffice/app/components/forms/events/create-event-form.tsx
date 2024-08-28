import { useRef } from 'react';
import { useFetcher } from '@remix-run/react';
import { format } from 'date-fns';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapInput } from '@/components/ui/map-input';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { z } from 'zod';

export const CreateEventFormDtoSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre del evento debe tener al menos 2 caracteres.',
  }),
  location: z.string().min(2, {
    message: 'La localización del evento debe tener al menos 2 caracteres.',
  }),
  date: z.date().default(new Date()),
  image: z.string(),
  scanning: z.boolean().default(false),
});
export type CreateEventFormDto = z.infer<typeof CreateEventFormDtoSchema>;

const formSchema = CreateEventFormDtoSchema;

export function CreateEventForm({
  onFormSubmitted,
}: {
  onFormSubmitted?: (values?: CreateEventFormDto | null) => void;
}) {
  const fetcher = useFetcher();

  const formRef = useRef(null);

  const form = useForm<CreateEventFormDto>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: '',
      date: new Date(),
      image: '',
      scanning: false,
    },
  });

  async function onSubmit(values: CreateEventFormDto) {
    try {
      fetcher.submit(formRef.current, {
        method: 'POST',
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
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evento</FormLabel>
                <FormControl>
                  <Input placeholder="Concierto de Artista" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn('pl-3 text-left font-normal w-full', 'text-muted-foreground')}
                      >
                        {format(field.value, 'PPP')}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={(e) => field.onChange(e)} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localidad</FormLabel>
                <FormControl>
                  <MapInput placeholder="C/Calle, Numero - Ciudad (Provincia)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen</FormLabel>
                <FormControl>
                  <Input placeholder="https://rutaimagen.com/imagen.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          variant="outline"
          className="w-full text-green-400"
          disabled={form.formState.isSubmitting}
        >
          Crear evento
        </Button>
      </form>
    </Form>
  );
}
