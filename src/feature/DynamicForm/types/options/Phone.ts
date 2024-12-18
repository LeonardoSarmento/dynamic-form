import { z } from 'zod';

export const PHONE_REGEX = /^\(?([1-9]{2})\)?\s?(9\d{4})-?(\d{4})$|^\(?([1-9]{2})\)?\s?(\d{4})-?(\d{4})$/;

export const applyPhoneMask = (value: string) => {
  const digits = value.replace(/\D/g, ''); // Remove caracteres não numéricos

  if (digits.length <= 10) {
    // Formato: (XX) XXXX-XXXX
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 15); // Limita o tamanho a 15 caracteres
  } else {
    // Formato: (XX) 9XXXX-XXXX
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15); // Limita o tamanho a 15 caracteres
  }
};

export const PhoneSchema = z
  .string({ required_error: 'Telefone é obrigatório' })
  .min(1, { message: 'Telefone não pode ser vazio' })
  .transform((val) => applyPhoneMask(val)) // Aplica a máscara
  .refine(
    (val) => {
      const digits = val.replace(/\D/g, ''); // Remove a máscara para validação
      return PHONE_REGEX.test(val) && (digits.length === 10 || digits.length === 11);
    },
    {
      message: 'Telefone inválido. Formato esperado: (XX) XXXX-XXXX ou (XX) 9XXXX-XXXX',
    },
  );
