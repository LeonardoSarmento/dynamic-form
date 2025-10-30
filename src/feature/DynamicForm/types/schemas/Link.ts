import { z } from 'zod';

export const LinkSchema = z
  .string()
  .refine((value) => /^(https?):\/\/(?=.*\.[a-z]{2,})[^\s$.?#].[^\s]*$/i.test(value), {
    message: 'Por favor, entre um valor válido.',
  })
  .catch('')
  .optional();

export type LinkSchemaType = z.infer<typeof LinkSchema>;
