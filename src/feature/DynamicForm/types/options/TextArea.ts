import { z } from 'zod';

export const TextareaSchema = z
  .string()
  .min(10, {
    message: 'Conteúdo deve possuir no mínimo 10 caracteres.',
  })
  .max(160, {
    message: 'Conteúdo deve possuir no máximo 160 caracteres',
  });
export type TextareaType = z.infer<typeof TextareaSchema>;
