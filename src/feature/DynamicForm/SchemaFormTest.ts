import { z } from 'zod';
import { DateRangeSchema, DateSchema } from '../DynamicForm/types/schemas/Date';
import { MultiSelectSchema } from '../DynamicForm/types/schemas/MultiSelect';
import { FileUploadSchema } from '../DynamicForm/types/schemas/FileUpload';
import { TextareaSchema } from '../DynamicForm/types/schemas/TextArea';
import { CheckboxSchema } from '../DynamicForm/types/schemas/Checkbox';
import { ComboboxSchema } from '../DynamicForm/types/schemas/Combobox';
import { SwitchSchema } from '../DynamicForm/types/schemas/Switch';
import { SelectSchema } from '../DynamicForm/types/schemas/Select';
import { RadioSchema } from '../DynamicForm/types/schemas/RadioGroup';
import { PhoneSchema } from '../DynamicForm/types/schemas/Phone';
import { MacAddress } from '../DynamicForm/types/schemas/MacAddress';
import { CpfSchema } from '../DynamicForm/types/schemas/Cpf';
import { IpSchema } from '../DynamicForm/types/schemas/Ip';
import cnpj from '../DynamicForm/types/schemas/CNPJ';

export const DynamicSchemaTestingComponent = z.object({
  input: z
    .string({
      required_error: 'Conteúdo é obrigatório.',
    })
    .min(2, { message: 'Conteúdo deve ter pelo menos 2 caracteres.' })
    .trim(),
  email: z.string({
    required_error: 'E-mail é obrigatório.',
  }).email({ message: 'E-mail inválido.' }).trim(),
  link: z
    .string({
      required_error: 'Link é obrigatório.',
    })
    .refine((value) => /^(https?):\/\/(?=.*\.[a-z]{2,})[^\s$.?#].[^\s]*$/i.test(value), {
      message: 'Por favor, escreva uma URL válida.',
    }),
  cnpj: cnpj(),
  phone: PhoneSchema,
  macAddress: MacAddress,
  ip: IpSchema,
  cpf: CpfSchema,
  password: z
    .string({ required_error: 'Senha é obrigatória.' })
    .min(8, {
      message: 'Senha deve conter no mínimo 8 caracteres.',
    })
    .trim()
    .regex(new RegExp('.*[A-Z].*'), { message: 'Senha deve conter pelo menos uma letra maiúscula.' })
    .regex(new RegExp('.*[a-z].*'), { message: 'Senha deve conter pelo menos uma letra minúscula.' })
    .regex(new RegExp('.*\\d.*'), { message: 'Senha deve conter pelo menos um número' })
    .regex(new RegExp('.*[!@#$%^&*.].*'), {
      message: 'Senha deve conter pelo menos um caractere especial: !@#$%^&*.',
    })
    .trim(),
  number: z
    .number({ required_error: 'Número é obrigatório.' })
    .int()
    .positive()
    .min(1, 'Valor mínimo de 1.')
    .max(100, 'Valor máximo de 100.'),
  checkbox: CheckboxSchema,
  combobox: ComboboxSchema,
  select: SelectSchema,
  multiSelect: MultiSelectSchema,
  radio: RadioSchema,
  switch: SwitchSchema,
  textarea: TextareaSchema,
  fileUpload: FileUploadSchema,
  date: DateSchema,
  rangeDate: DateRangeSchema,
});
export type DynamicSchemaTestingComponentType = z.infer<typeof DynamicSchemaTestingComponent>;
