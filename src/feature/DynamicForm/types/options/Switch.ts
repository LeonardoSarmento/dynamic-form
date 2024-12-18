import { z } from 'zod';

export const SwitchSchema = z.boolean({ required_error: 'Selecione uma opção.' });
export type SwitchType = z.infer<typeof SwitchSchema>;
