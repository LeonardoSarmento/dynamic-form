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
  classnameitem: z.string().optional(),

  hideerrormessage: z.boolean().optional(),
  classnamemessage: z.string().optional(),

  label: z.string().optional(),
  hidelabel: z.boolean().optional(),
  classnamelabel: z.string().optional(),

  description: z.string().optional(),
  hidedescription: z.boolean().optional(),
  classnamedescription: z.string().optional(),
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
  control: Control<TFieldValues>;

  name: Path<TFieldValues>;

  className?: string;
} & ExtendedFormProps;
