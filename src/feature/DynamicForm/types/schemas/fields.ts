import { z } from 'zod';
import { ComboboxOptionsSchema } from './Combobox';
import { CheckboxOptionsSchema } from './Checkbox';
import { DateLocaleSchema, DateModeSchema } from './Date';
import { MultiSelectOptionsSchema } from './MultiSelect';
import { RadioOptionsSchema } from './RadioGroup';
import { SelectOptionsSchema } from './Select';

const baseTypeOptionsSchema = z.enum(['input', 'password', 'number', 'hierarchical', 'textarea', 'link']);

const maskSchema = z
  .union([
    z.literal('cnpj'),
    z.literal('cpf'),
    z.literal('ip'),
    z.literal('macAddress'),
    z.literal('phone'),
    z.literal('currency'),
    z.function({
      input: z.tuple([z.string()]),
      output: z.string(),
    }),
  ])
  .optional();

export const baseInputSchema = z.object({
  type: baseTypeOptionsSchema,
  placeholder: z.string(),
  mask: maskSchema,
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

export const SliderInputSchema = z.object({
  /* Array de opções para o component de select. */
  type: z.literal('slider'),
  placeholder: z.string().optional(),
  unit: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  titles: z.array(z.string()).max(2).optional(),
});

export const MultiSelectInputSchema = z.object({
  type: z.literal('multi-select'),
  /* Array de opções para o component de multi-select. */
  multiselectoptions: MultiSelectOptionsSchema,
  disabledTrigger: z.boolean().optional(),
  itensShown: z.number().optional(),
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
  reSelect: z.boolean().optional(),
});

export const DateInputSchema = z.object({
  /* Array de opções para o component de date. */
  type: z.literal('date'),
  placeholder: z.string().optional(),
  disabledInput: z.boolean().optional(),
  customLocale: DateLocaleSchema.optional(),
  mode: DateModeSchema,
  format: z.enum(['long', 'short']).default('long').optional(),
});

export const SmartDatetimeInputSchema = z.object({
  /* Array de opções para o component de select. */
  type: z.literal('datetime-input'),
  disabled: z.union([z.boolean(), z.function({ input: z.tuple([z.date()]), output: z.boolean() })]).optional(),
});

export const RadioInputSchema = z.object({
  /* Array de opções para o component de radio. */
  type: z.literal('radio'),
  radiooptions: RadioOptionsSchema,
});
