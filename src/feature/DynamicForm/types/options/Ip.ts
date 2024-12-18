import { z } from 'zod';

export const IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
export function applyIPMask(value: string): string {
  // Remove all non-numeric characters
  const numericValue = value.replace(/[^\d]/g, '');

  // Break the numeric value into segments of up to 3 digits
  const segments: string[] = [];
  for (let i = 0; i < numericValue.length && segments.length < 4; i += 3) {
    segments.push(numericValue.slice(i, i + 3));
  }

  // Ensure each segment is clamped to a maximum of 255
  const validSegments = segments.map((segment) => {
    const number = parseInt(segment, 10);
    return Math.min(number, 255).toString();
  });

  // Join the segments with dots
  return validSegments.join('.');
}

export const IpSchema = z
  .string()
  .min(1, { message: 'IP não pode ser vazio' })
  .refine(
    (ip) => {
      const regex = IP_REGEX;
      return regex.test(ip);
    },
    {
      message: 'Formato de IP inválido',
    },
  );
