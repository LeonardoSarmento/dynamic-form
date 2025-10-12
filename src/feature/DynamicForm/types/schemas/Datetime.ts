import { z } from 'zod';

export const DatetimeSchema = z.date({
  error: (iss) => (iss.input === undefined ? 'A data é obrigatória.' : 'Data inválida'),
});
export type DateType = z.infer<typeof DatetimeSchema>;
