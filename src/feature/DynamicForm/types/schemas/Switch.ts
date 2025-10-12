import { z } from 'zod';

export const SwitchSchema = z.boolean('Selecione uma opção.');
export type SwitchType = z.infer<typeof SwitchSchema>;
