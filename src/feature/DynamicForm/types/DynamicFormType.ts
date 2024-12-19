import { z } from 'zod';
import { Control, FieldValues, Path } from 'react-hook-form';
import {
  baseInputSchema,
  CheckboxInputSchema,
  ComboboxInputSchema,
  DateInputSchema,
  FileUploadInputSchema,
  MultiSelectInputSchema,
  RadioInputSchema,
  SelectInputSchema,
  SwitchInputSchema,
} from './schemas/fields';
import { ExtendedFormProps } from './formField';

const DynamicFormSchema = z.object({
  /* Texto que será renderizado antes do usuários preencher o campo ou título do componente. */

  /* Se deve esconder a renderização da mensagem de error. */
  hideErrorMessage: z.boolean().optional(),

  /* Se deve esconder a renderização do componente label do hook-form. */
  hideLabel: z.boolean().optional(),

  /* Se deve esconder a renderização do componente description do hook-form. */
  hideDescription: z.boolean().optional(),

  description: z.string().optional(),

  label: z.string().optional(),

  classNameItem: z.string().optional(),

  classNameMessage: z.string().optional(),
});

export const DynamicFormTypeSchema = z
  .discriminatedUnion('type', [
    baseInputSchema,
    ComboboxInputSchema,
    CheckboxInputSchema,
    MultiSelectInputSchema,
    RadioInputSchema,
    SelectInputSchema,
    SwitchInputSchema,
    FileUploadInputSchema,
    DateInputSchema,
  ])
  .and(DynamicFormSchema);

export type DynamicFormType<TFieldValues extends FieldValues> = z.infer<typeof DynamicFormTypeSchema> & {
  /* Propriedade control do hook useForm do react-hook-form. */
  control: Control<TFieldValues>;

  /* Propriedade name do hook useForm do react-hook-form. */
  name: Path<TFieldValues>;

  className?: string;
} & ExtendedFormProps;
