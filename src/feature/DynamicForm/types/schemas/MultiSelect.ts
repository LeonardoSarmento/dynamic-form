import { z } from 'zod';

export const MultiSelectSchema = z.array(z.string()).nonempty('Por favor selecione pelo menos uma opção.');
export type MultiSelectType = z.infer<typeof MultiSelectSchema>;

export const MultiSelectOptionsSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    disabled: z.boolean().optional(),
  })
  .array();
export type MultiSelectOptionsType = z.infer<typeof MultiSelectOptionsSchema>;
