import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";

function extractMessages(errors: FieldErrors, parentKey = ''): { field: string; message: string }[] {
  const messages: { field: string; message: string }[] = [];

  for (const key in errors) {
    const error = errors[key];
    const fieldName = parentKey ? `${parentKey}.${key}` : key;

    if (!error) continue;

    if (typeof error === 'object' && !Array.isArray(error)) {
      if ('message' in error && typeof error.message === 'string') {
        messages.push({ field: fieldName, message: error.message });
      }

      // Recursivamente trata objetos aninhados
      messages.push(...extractMessages(error as FieldErrors, fieldName));
    }

    if (Array.isArray(error)) {
      for (let i = 0; i < error.length; i++) {
        const e = error[i];
        if (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') {
          messages.push({ field: `${fieldName}[${i}]`, message: e.message });
        }
      }
    }
  }

  return messages;
}

export function showErrorsAsToasts(errors: FieldErrors) {
  const messages = extractMessages(errors);

  messages.forEach(({ field, message }) => {
    toast.error(`Campo: ${field}`, {
      description: message,
    });
  });
}
