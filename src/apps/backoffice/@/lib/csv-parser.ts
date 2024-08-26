import Papa from 'papaparse';

export async function parseCsv(file: File, withHeaders: boolean = true, separator: string = ','): Promise<any[]> {
  const result = Papa.parse<any[]>(await file.text(), {
    delimiter: separator,
    header: withHeaders,
  });

  return result.data;
}
