import { z } from 'zod';

export interface HierarchicalOption {
  id: string;
  label: string;
  disabled?: boolean;
  children?: HierarchicalOption[];
}

export const HierarchicalOptionSchema: z.ZodType<HierarchicalOption> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),
    disabled: z.boolean().optional(),
    children: z.array(HierarchicalOptionSchema).optional(),
  }),
);

export type HierarchicalOptionType = z.infer<typeof HierarchicalOptionSchema>;

export const HierarchicalSchema = z
  .array(z.string('Por favor selecione uma opção.'))
  .refine((values) => values.length >= 1, {
    message: 'É preciso selecionar pelo menos uma opção.',
  })
  .refine((values) => values.length <= 10, {
    message: 'Você pode selecionar no máximo 10 opções.',
  });

export type HierarchicalType = z.infer<typeof HierarchicalSchema>;
