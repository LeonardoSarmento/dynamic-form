import { z } from 'zod';

export const applyCurrencyMask = (value: string) => {
  if (!value) return '';

  const normalized = value.replace(/[^0-9,\\.]/g, '').replace(',', '.');

  if (!normalized) return '';

  const number = parseFloat(normalized);
  if (isNaN(number)) return '';

  const hasDecimal = /[.,]\d{1,2}$/.test(value);

  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: hasDecimal ? 1 : 0,
    maximumFractionDigits: hasDecimal ? 2 : 0,
  });
};

export const CurrencySchema = z
  .string({ required_error: 'Valor é obrigatório' })
  .min(1, { message: 'Valor não pode ser vazio' })
  .transform((val) => applyCurrencyMask(val));
