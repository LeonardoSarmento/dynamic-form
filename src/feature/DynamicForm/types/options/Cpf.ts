import { z } from 'zod';

export const CPF_REGEX = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
export function applyCPFMask(value: string): string {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '');

  // Apply the CPF mask: XXX.XXX.XXX-XX
  const part1 = numericValue.slice(0, 3);
  const part2 = numericValue.slice(3, 6);
  const part3 = numericValue.slice(6, 9);
  const part4 = numericValue.slice(9, 11);

  // Combine the parts with the CPF format
  const formattedCPF = [part1, part2, part3].filter(Boolean).join('.') + (part4 ? `-${part4}` : '');

  return formattedCPF;
}

function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanedCPF = cpf.replace(/\D/g, '');

  // CPF deve ter exatamente 11 dígitos e não pode ter todos os dígitos iguais
  if (cleanedCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanedCPF)) {
    return false;
  }

  const digits = cleanedCPF.split('').map(Number);

  // Função auxiliar para calcular os dígitos verificadores
  const calculateVerifier = (base: number[]) => {
    const length = base.length;
    const sum = base.reduce((acc, digit, index) => acc + digit * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstVerifier = calculateVerifier(digits.slice(0, 9));
  const secondVerifier = calculateVerifier(digits.slice(0, 10));

  return firstVerifier === digits[9] && secondVerifier === digits[10];
}

export const CpfSchema = z
  .string({ required_error: 'Cpf é obrigatório' })
  .min(1, { message: 'CPF não pode ser vazio' })
  .regex(CPF_REGEX, 'Formato inválido para CPF. Formato esperado: XXX.XXX.XXX-XX')
  .refine((cpf) => isValidCPF(cpf), {
    message: 'Valor de CPF inválido',
  });

export type CPFType = z.infer<typeof CpfSchema>;
