export interface Response<TBody> {
  status: number;
  statusText?: string;
  headers?: Headers;
  body: TBody;
}
