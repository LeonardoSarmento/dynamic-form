import { z } from 'zod';
import { ComboboxOptionsSchema } from './Combobox';
import { CheckboxOptionsSchema } from './Checkbox';
import { DateLocaleSchema, DateModeSchema } from './Date';
import { MultiSelectOptionsSchema } from './MultiSelect';
import { RadioOptionsSchema } from './RadioGroup';
import { SelectOptionsSchema } from './Select';

export const baseInputSchema = z.object({
  type: z.enum(['input', 'password', 'number', 'textarea', 'link']),
  placeholder: z.string(),
  mask: z
    .union([
      z.literal('cnpj'),
      z.literal('cpf'),
      z.literal('ip'),
      z.literal('macAddress'),
      z.literal('phone'),
      z.function().args(z.string()).returns(z.string()),
    ])
    .optional(),
});

export const ComboboxInputSchema = z.object({
  /* Array de opções para o component de combobox. */
  type: z.literal('combobox'),
  comboboxoptions: ComboboxOptionsSchema,
  placeholder: z.string().optional(),
  optionsnotfoundtext: z.string().optional(),
});

export const SelectInputSchema = z.object({
  /* Array de opções para o component de select. */
  type: z.literal('select'),
  selectoptions: SelectOptionsSchema,
  placeholder: z.string().optional(),
});

export const MultiSelectInputSchema = z.object({
  type: z.literal('multi-select'),
  /* Array de opções para o component de multi-select. */
  multiselectoptions: MultiSelectOptionsSchema,
  placeholder: z.string().optional(),
});

export const CheckboxInputSchema = z.object({
  /* Array de opções para o component de checkbox. */
  type: z.literal('checkbox'),
  checkboxoptions: CheckboxOptionsSchema,
});

export const SwitchInputSchema = z.object({
  /* Array de opções para o component de switch. */
  type: z.literal('switch'),
  disabled: z.boolean().optional(),
});

export const FileUploadInputSchema = z.object({
  /* Array de opções para o component de file upload. */
  type: z.literal('file-upload'),
  disabled: z.boolean().optional(),
});

export const DateInputSchema = z.object({
  /* Array de opções para o component de date. */
  type: z.literal('date'),
  placeholder: z.string().optional(),
  customLocale: DateLocaleSchema.optional(),
  mode: DateModeSchema,
  format: z.enum(['long', 'short']).default('long').optional(),
});

export const RadioInputSchema = z.object({
  /* Array de opções para o component de radio. */
  type: z.literal('radio'),
  radiooptions: RadioOptionsSchema,
});
