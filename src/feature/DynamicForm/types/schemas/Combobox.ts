import { z } from 'zod';

/**
 * Schema for a single-select combobox value
 */
export const SingleComboboxSchema = z.string({
  error: 'Por favor selecione uma opção.',
});

/**
 * Schema for a multi-select combobox value (array of strings)
 */
export const MultipleComboboxSchema = z.array(z.string()).min(1, 'Selecione pelo menos uma opção.');

/**
 * Unified schema (you can pick one dynamically depending on mode)
 */
export const ComboboxSchema = z.union([SingleComboboxSchema, MultipleComboboxSchema]);

export type ComboboxType = z.infer<typeof ComboboxSchema>;

/**
 * Schema for options list
 */
export const ComboboxOptionsSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    disabled: z.boolean().optional(),
  })
  .array();

export type ComboboxOptionsType = z.infer<typeof ComboboxOptionsSchema>;
