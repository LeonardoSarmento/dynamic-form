import * as React from 'react';
import { cn } from '../../lib/utils';

export type HyperlinkInputProps = React.InputHTMLAttributes<HTMLInputElement> & { hint?: string };

function isValidLink(value: string): boolean {
  const regex = /^(https?):\/\/(?=.*\.[a-z]{2,})[^\s$.?#].[^\s]*$/i;
  return regex.test(value);
}

function isValidEmail(value: string): boolean {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
  return regex.test(value);
}

const HyperlinkInput = React.forwardRef<HTMLInputElement, HyperlinkInputProps>(
  ({ className, hint, onChange, value, ...props }, ref) => {
    const [url, setUrl] = React.useState('');
    const inputValue = typeof value === 'string' ? value : url;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    const linkHref = isValidLink(inputValue) ? inputValue : isValidEmail(inputValue) ? `mailto:${inputValue}` : null;

    return (
      <div className="relative gap-x-5">
        <input
          type="url"
          className={cn(
            'flex h-9 w-full rounded-md border border-primary bg-transparent px-3 py-1 pe-12 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          value={inputValue}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        {hint && (
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
        )}
        {linkHref && (
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-y-0 end-0 flex items-center pe-3 text-sm text-primary hover:underline"
            onClick={(e) => e.stopPropagation()} // Prevent input focus loss
          >
            Abrir
          </a>
        )}
      </div>
    );
  },
);

HyperlinkInput.displayName = 'HyperlinkInput';

export { HyperlinkInput };
