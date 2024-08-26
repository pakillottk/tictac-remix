import { useEffect, useState } from 'react';
import { parseCsv } from '@/lib/csv-parser';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Form } from '@remix-run/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { set } from 'date-fns';

export function ImportCodesDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [delimiter, setDelimiter] = useState(',');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setFile(file);
  };

  useEffect(() => {
    if (!file) {
      return;
    }

    setParsing(true);
    parseCsv(file, true, delimiter)
      .then((data) => {
        if (data.length > 0) {
          if (!data[0].type || !data[0].code) {
            setError('El archivo CSV debe tener las columnas "type" y "code"');
            setParsedData([]);
            return;
          }
        }
        setError(null);
        setParsedData(data);
      })
      .catch((error) => {
        setError('Error al parsear el archivo CSV: ' + error.toString());
      })
      .finally(() => {
        setParsing(false);
      });
  }, [file, delimiter]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar códigos</DialogTitle>
          <DialogDescription>Importar códigos desde un archivo CSV</DialogDescription>
        </DialogHeader>

        <Label htmlFor="csv-delimiter">Separador</Label>
        <Select name="csv-delimiter" defaultValue="," value={delimiter} onValueChange={setDelimiter}>
          <SelectTrigger>
            <SelectValue>{delimiter}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=",">,</SelectItem>
            <SelectItem value=";">;</SelectItem>
          </SelectContent>
        </Select>

        <Label htmlFor="csv-file">CSV</Label>
        <Input id="csv-file" name="csv-file" type="file" disabled={parsing} onChange={handleFileChange} />
        {parsing && <p>Parsing...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="h-[300px] overflow-auto relative">
          <Table>
            <TableHeader>
              <TableRow className="sticky top-0 z-10 bg-background border-b-2">
                <TableHead>Tipo</TableHead>
                <TableHead>Código</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parsedData.map((row, index) => (
                <TableRow key={index}>
                  <TableHead>{row.type}</TableHead>
                  <TableHead>{row.code}</TableHead>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <>
            <p className="text-sm text-muted-foreground">Se importarán {parsedData.length} códigos</p>
            <Form
              method="POST"
              action="codes"
              onSubmit={() => {
                setOpen(false);
              }}
            >
              <input type="hidden" name="parsed-codes" id="parsed-codes" readOnly value={JSON.stringify(parsedData)} />
              <Button type="submit" disabled={parsedData.length === 0 || parsing}>
                Importar
              </Button>
            </Form>
          </>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
