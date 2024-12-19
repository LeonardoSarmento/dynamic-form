import { z } from 'zod';

export const FileUploadSchema = z
  .array(
    z.instanceof(File).refine((file) => file.size < 20 * 1024 * 1024, {
      message: 'Tamanho de arquivo deve ser no máximo 20MB.',
    }),
    { required_error: 'Deve ser enviado pelo menos um arquivo.' },
  )
  .min(1, { message: 'Arquivo é obrigatório.' })
  .max(5, {
    message: 'Permitido no máximo 5 arquivos.',
  })
  .nullable();
export type FileUploadType = z.infer<typeof FileUploadSchema>;

export const UniqueFileUploadSchema = z
  .instanceof(File, { message: 'Arquivo é obritório.' })
  .refine((file) => file.size < 20 * 1024 * 1024, {
    message: 'Tamanho de arquivo deve ser no máximo 20MB.',
  })
  .nullable();
export type UniqueFileUploadType = z.infer<typeof UniqueFileUploadSchema>;
