import { z } from 'zod';

export const MAC_ADDRESS_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

export const applyMacAddressMask = (value: string): string => {
  const cleaned = value.replace(/[^0-9A-Fa-f]/g, '');
  let masked = '';
  for (let i = 0; i < cleaned.length; i++) {
    if (i !== 0 && i % 2 === 0 && i < 12) {
      masked += ':';
    }
    masked += cleaned[i];
  }
  return masked.toUpperCase();
};

export const MacAddress = z
  .string({ required_error: 'MAC Address é obrigatório' })
  .min(1, { message: 'MAC Address não pode ser vazio' })
  .regex(MAC_ADDRESS_REGEX, { message: 'Formato inválido de MAC Address' });

export type MacAddressType = z.infer<typeof MacAddress>;
