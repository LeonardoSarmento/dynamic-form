import { z } from 'zod';

export const ComboboxSchema = z.string('Por favor selecione uma opção.');
export type ComboboxType = z.infer<typeof ComboboxSchema>;

export const ComboboxOptionsSchema = z
  .object({ id: z.string(), label: z.string(), disabled: z.boolean().optional() })
  .array();
export type ComboboxOptionsType = z.infer<typeof ComboboxOptionsSchema>;
