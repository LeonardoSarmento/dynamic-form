import { z } from 'zod';

export const SliderSchema = z.union([z.tuple([z.number()]), z.tuple([z.number(), z.number()])]);
export type SliderType = z.infer<typeof SliderSchema>;
