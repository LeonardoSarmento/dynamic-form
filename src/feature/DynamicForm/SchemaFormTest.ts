import { z } from 'zod';

import { MultipleComboboxSchema, SingleComboboxSchema } from '../DynamicForm/types/schemas/Combobox';
import { DateRangeSchema, DateSchema } from '../DynamicForm/types/schemas/Date';
import { MultiSelectSchema } from '../DynamicForm/types/schemas/MultiSelect';
import { FileUploadSchema } from '../DynamicForm/types/schemas/FileUpload';
import { TextareaSchema } from '../DynamicForm/types/schemas/TextArea';
import { CheckboxSchema } from '../DynamicForm/types/schemas/Checkbox';
import { SwitchSchema } from '../DynamicForm/types/schemas/Switch';
import { SelectSchema } from '../DynamicForm/types/schemas/Select';
import { RadioSchema } from '../DynamicForm/types/schemas/RadioGroup';
import { PhoneSchema } from '../DynamicForm/types/schemas/Phone';
import { MacAddress } from '../DynamicForm/types/schemas/MacAddress';
import { CpfSchema } from '../DynamicForm/types/schemas/Cpf';
import { IpSchema } from '../DynamicForm/types/schemas/Ip';
import cnpj from '../DynamicForm/types/schemas/CNPJ';

import { HierarchicalSchema } from './types/schemas/Hierarchical';
import { DatetimeSchema } from './types/schemas/Datetime';
import { SliderSchema } from './types/schemas/Slider';
import { LinkSchema } from './types/schemas/Link';

export const DynamicSchemaTestingComponent = z.object({
  input: z.string('Conteúdo é obrigatório.').min(2, { message: 'Conteúdo deve ter pelo menos 2 caracteres.' }).trim(),
  email: z
    .email({
      error: (iss) => (iss.input === undefined ? 'E-mail é obrigatório.' : 'E-mail inválido'),
    })
    .trim(),
  cnpj: cnpj(),
  link: LinkSchema,
  phone: PhoneSchema,
  macAddress: MacAddress,
  ip: IpSchema,
  cpf: CpfSchema,
  password: z
    .string('Senha é obrigatória.')
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
    .number('Número é obrigatório.')
    .int()
    .positive()
    .min(1, 'Valor mínimo de 1.')
    .max(100, 'Valor máximo de 100.'),
  checkbox: CheckboxSchema,
  comboboxSingle: SingleComboboxSchema,
  comboboxMultiple: MultipleComboboxSchema,
  select: SelectSchema,
  slider: SliderSchema,
  sliderDouble: SliderSchema,
  multiSelect: MultiSelectSchema,
  hierarchical: HierarchicalSchema,
  radio: RadioSchema,
  switch: SwitchSchema,
  textarea: TextareaSchema,
  fileUpload: FileUploadSchema,
  date: DateSchema,
  datetime: DatetimeSchema,
  rangeDate: DateRangeSchema,
});
export type DynamicSchemaTestingComponentType = z.infer<typeof DynamicSchemaTestingComponent>;
