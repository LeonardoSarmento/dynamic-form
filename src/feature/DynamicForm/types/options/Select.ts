import { z } from 'zod';

export const SelectSchema = z.string({
  required_error: 'Por favor selecione uma opção.',
});
export type SelectType = z.infer<typeof SelectSchema>;

export const SelectOptionsSchema = z.string().array();
export type SelectOptionsType = z.infer<typeof SelectOptionsSchema>;
