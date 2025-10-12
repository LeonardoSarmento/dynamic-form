'use client';

import React from 'react';
import { parseDate } from 'chrono-node';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar, CalendarProps } from '../ui/calendar';
import { Button, buttonVariants } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

/* -------------------------------------------------------------------------- */
/*                               Inspired By:                                 */
/*                               @steventey                                   */
/* ------------------https://dub.co/blog/smart-datetime-picker--------------- */
/* -------------------------------------------------------------------------- */

/**
 * Utility function that parses dates.
 * Parses a given date string using the `chrono-node` library.
 *
 * @param str - A string representation of a date and time.
 * @returns A `Date` object representing the parsed date and time, or `null` if the string could not be parsed.
 */
export const parseDateTime = (str: Date | string) => {
  if (str instanceof Date) return str;
  return parseDate(str);
};

/**
 * Converts a given timestamp or the current date and time to a string representation in the local time zone.
 * format: `HH:mm`, adjusted for the local time zone.
 *
 * @param timestamp {Date | string}
 * @returns A string representation of the timestamp
 */
export const getDateTimeLocal = (timestamp?: Date): string => {
  const d = timestamp ? new Date(timestamp) : new Date();
  if (d.toString() === 'Data inválida') return '';
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split(':').slice(0, 2).join(':');
};

/**
 * Returns the earliest date (starting with today) that is not disabled by the matcher.
 * If no dates are `disabled`, we default to new Date().
 *
 * @param disabled - A boolean disabling the entire input, or a matcher function for valid dates.
 * @returns A `Date` object representing the earliest valid date.
 */
const getValidBaseDate = (disabled?: boolean | ((date: Date) => boolean)): Date => {
  if (typeof disabled !== 'function') return new Date();
  let potential = new Date();
  const MAX_DAYS = 365;
  for (let i = 0; i < MAX_DAYS; i++) {
    if (!disabled(potential)) {
      return potential;
    }
    potential = new Date(potential.getTime());
    potential.setDate(potential.getDate() + 1);
  }
  return new Date();
};

/**
 * Formats a given date and time object or string into a human-readable string representation.
 * "MMM D, YYYY h:mm A" (e.g. "Jan 1, 2023 12:00 PM").
 *
 * @param datetime - {Date | string}
 * @returns A string representation of the date and time
 */
export const formatDateTime = (datetime: Date | string) => {
  const date = new Date(datetime);

  if (isNaN(date.getTime())) {
    return 'Data Inválida';
  }

  return date.toLocaleString('pt-BR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
};

const inputBase =
  'bg-transparent focus:outline-none focus:ring-0 focus-within:outline-none focus-within:ring-0 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50';

// @source: https://www.perplexity.ai/search/in-javascript-how-RfI7fMtITxKr5c.V9Lv5KA#1
// use this pattern to validate the transformed date string for the natural language input
// const naturalInputValidationPattern = '^[A-Z][a-z]{2}sd{1,2},sd{4},sd{1,2}:d{2}s[AP]M$';

// const DEFAULT_SIZE = 96;

/**
 * Smart time input Docs: {@link: https://shadcn-extension.vercel.app/docs/smart-time-input}
 */

export interface SmartDatetimeInputProps {
  value?: Date;
  onValueChange?: (date: Date) => void;
  disabledDates?: CalendarProps['disabled'];
  disabled?: boolean | ((date: Date) => boolean);
}

interface SmartDatetimeInputContextProps extends SmartDatetimeInputProps {
  Time: string;
  onTimeChange: (time: string) => void;
}

const SmartDatetimeInputContext = React.createContext<SmartDatetimeInputContextProps | null>(null);

const useSmartDateInput = () => {
  const context = React.useContext(SmartDatetimeInputContext);
  if (!context) {
    throw new Error('useSmartDateInput must be used within SmartDateInputProvider');
  }
  return context;
};

export const SmartDatetimeInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'type' | 'ref' | 'value' | 'defaultValue' | 'onBlur'> &
    SmartDatetimeInputProps
>(({ className, value, onValueChange, placeholder, disabled, disabledDates }, ref) => {
  // ? refactor to be only used with controlled input
  /*  const [dateTime, setDateTime] = React.useState<Date | undefined>(
    value ?? undefined
  ); */

  const [Time, setTime] = React.useState<string>('');

  const onTimeChange = React.useCallback((time: string) => {
    setTime(time);
  }, []);

  return (
    <SmartDatetimeInputContext.Provider value={{ value, onValueChange, Time, onTimeChange, disabled, disabledDates }}>
      <div className="flex items-center justify-center">
        <div
          className={cn(
            'flex w-full items-center justify-between gap-1 rounded-md border p-0 transition-all',
            'focus-within:outline-0 focus:outline-0',
            'placeholder:text-muted-foreground focus-visible:outline-0',
            'focus-within:ring-ring focus-within:ring-1',
            className,
          )}
        >
          <DateTimeLocalInput disabled={disabledDates} />
          <NaturalLanguageInput
            placeholder={placeholder}
            disabled={typeof disabled === 'boolean' ? disabled : false}
            ref={ref}
          />
        </div>
      </div>
    </SmartDatetimeInputContext.Provider>
  );
});

SmartDatetimeInput.displayName = 'DatetimeInput';

/**
 * Checa se um horário específico deve ser desabilitado.
 * @param baseDate - A data selecionada no calendário
 * @param hour - Hora do dia (0-23)
 * @param minute - Minuto do horário
 * @param disabledTime - Função ou boolean para desabilitar horários
 * @returns true se o horário deve ser desabilitado
 */
const isTimeDisabled = (
  baseDate: Date,
  hour: number,
  minute: number,
  disabledTime?: boolean | ((date: Date) => boolean),
) => {
  if (typeof disabledTime === 'boolean') return disabledTime;

  if (typeof disabledTime === 'function') {
    const dateToCheck = new Date(baseDate);
    dateToCheck.setHours(hour, minute, 0, 0);
    return disabledTime(dateToCheck);
  }

  return false;
};

const TimePicker = () => {
  const { value, onValueChange, Time, onTimeChange, disabled } = useSmartDateInput();
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const timestamp = 15;

  const formatSelectedTime = React.useCallback(
    (time: string, hour: number, partStamp: number) => {
      onTimeChange(time);

      const base = value ? new Date(value) : getValidBaseDate(disabled);
      const newVal = parseDateTime(base);
      if (!newVal) return;

      newVal.setHours(hour, partStamp === 0 ? 0 : timestamp * partStamp);
      if (typeof disabled === 'function' && disabled(newVal)) return;

      onValueChange?.(newVal);
    },
    [value, onValueChange, onTimeChange, disabled],
  );

  const handleKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const total = 24 * 4;

      const moveNext = () => setActiveIndex((prev) => (prev + 1) % total);
      const movePrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);

      const setElement = () => {
        const currentElm = document.getElementById(`time-${activeIndex}`);
        if (!currentElm) return;

        const timeValue = currentElm.textContent ?? '';
        const [hPart, rest] = timeValue.split(':');
        const [mPart] = rest.split(' '); // remove AM/PM se não usar
        const hour = parseInt(hPart);
        const part = Math.floor(parseInt(mPart) / timestamp);

        formatSelectedTime(timeValue, hour, part);
      };

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          movePrev();
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveNext();
          break;
        case 'Escape':
          setActiveIndex(-1);
          break;
        case 'Enter':
          setElement();
          break;
      }
    },
    [activeIndex, formatSelectedTime],
  );

  const handleClick = React.useCallback(
    (hour: number, part: number, index: number) => {
      const timeLabel = `${hour}:${part === 0 ? '00' : timestamp * part}`;
      formatSelectedTime(timeLabel, hour, part);
      setActiveIndex(index);
    },
    [formatSelectedTime],
  );

  const currentTime = React.useMemo(() => {
    if (!Time) return { hours: -1, minutes: -1 };
    const [h, m] = Time.split(':').map(Number);
    return { hours: h, minutes: m };
  }, [Time]);

  return (
    <div className="relative space-y-2 py-3 pr-3">
      <h3 className="text-center text-sm font-medium">Horário</h3>
      <ScrollArea onKeyDown={handleKeydown} className="h-[90%] w-full py-0.5 focus:outline-none">
        <ul className="flex h-full max-h-56 w-28 flex-col items-center gap-1 px-4 py-0.5">
          {Array.from({ length: 24 }).map((_, i) =>
            Array.from({ length: 4 }).map((_, part) => {
              const baseDate = value ? new Date(value) : getValidBaseDate(disabled);
              const disabledByTime = isTimeDisabled(baseDate, i, part * timestamp, disabled);

              const currentValue = `${i}:${part === 0 ? '00' : timestamp * part}`;
              const trueIndex = i * 4 + part;

              const isSelected =
                currentTime.hours === i && Math.abs(currentTime.minutes - part * timestamp) < timestamp / 2;

              return (
                <li
                  key={`time-${trueIndex}`}
                  id={`time-${trueIndex}`}
                  tabIndex={isSelected ? 0 : -1}
                  aria-disabled={disabledByTime}
                  className={cn(
                    buttonVariants({ variant: isSelected ? 'default' : 'outline' }),
                    'h-8 w-full px-3 text-sm focus:outline-none',
                    disabledByTime && 'text-muted-foreground cursor-not-allowed opacity-40 select-none',
                  )}
                  onClick={() => !disabledByTime && handleClick(i, part, trueIndex)}
                >
                  {currentValue}
                </li>
              );
            }),
          )}
        </ul>
      </ScrollArea>
    </div>
  );
};

const NaturalLanguageInput = React.forwardRef<
  HTMLInputElement,
  {
    placeholder?: string;
    disabled?: boolean;
  }
>(({ placeholder, ...props }, ref) => {
  const { value, onValueChange, Time, onTimeChange, disabled } = useSmartDateInput();

  const _placeholder = placeholder ?? 'e.g. "tomorrow at 5pm"';

  const [inputValue, setInputValue] = React.useState<string>('');

  React.useEffect(() => {
    const hour = new Date().getHours();
    const timeVal = `${hour >= 12 ? hour % 12 : hour}:${new Date().getMinutes()} ${hour >= 12 ? 'PM' : 'AM'}`;
    setInputValue(value ? formatDateTime(value) : '');
    onTimeChange(value ? Time : timeVal);
  }, [value, Time]);

  const handleParse = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // parse the date string when the input field loses focus
      const parsedDateTime = parseDateTime(e.currentTarget.value);
      if (parsedDateTime) {
        // If a matcher function was passed, prevent selecting a disabled (past) date
        if (disabled && typeof disabled != 'boolean' && disabled(parsedDateTime)) {
          // Invalid input--time already passed
          return;
        }
        const PM_AM = parsedDateTime.getHours() >= 12 ? 'PM' : 'AM';
        //fix the time format for this value

        const PM_AM_hour = parsedDateTime.getHours();

        const hour = PM_AM_hour > 12 ? PM_AM_hour % 12 : PM_AM_hour === 0 || PM_AM_hour === 12 ? 12 : PM_AM_hour;

        if (onValueChange) onValueChange(parsedDateTime);
        setInputValue(formatDateTime(parsedDateTime));
        onTimeChange(`${hour}:${parsedDateTime.getMinutes()} ${PM_AM}`);
      }
    },
    [value],
  );

  const handleKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Enter':
          const parsedDateTime = parseDateTime(e.currentTarget.value);
          if (parsedDateTime) {
            if (disabled && typeof disabled != 'boolean' && disabled(parsedDateTime)) {
              return;
            }
            const PM_AM = parsedDateTime.getHours() >= 12 ? 'PM' : 'AM';
            //fix the time format for this value

            const PM_AM_hour = parsedDateTime.getHours();

            const hour = PM_AM_hour > 12 ? PM_AM_hour % 12 : PM_AM_hour === 0 || PM_AM_hour === 12 ? 12 : PM_AM_hour;

            if (onValueChange) onValueChange(parsedDateTime);
            setInputValue(formatDateTime(parsedDateTime));
            onTimeChange(`${hour}:${parsedDateTime.getMinutes()} ${PM_AM}`);
          }
          break;
      }
    },
    [value],
  );

  return (
    <Input
      ref={ref}
      type="text"
      placeholder={_placeholder}
      value={inputValue}
      onChange={(e) => setInputValue(e.currentTarget.value)}
      onKeyDown={handleKeydown}
      onBlur={handleParse}
      className={cn(
        'flex-1 rounded border-none px-1 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none',
        inputBase,
      )}
      {...props}
    />
  );
});

NaturalLanguageInput.displayName = 'NaturalLanguageInput';

type DateTimeLocalInputProps = CalendarProps;

const DateTimeLocalInput = ({ className }: DateTimeLocalInputProps) => {
  const { value, onValueChange, Time, onTimeChange, disabled, disabledDates } = useSmartDateInput();

  const handleDateChange = (selectedDate: Date) => {
    if (typeof disabledDates === 'function' && disabledDates(selectedDate)) return;

    const newDate = new Date(selectedDate);

    // Mantém o horário atual
    let hours = 0;
    let minutes = 0;
    if (Time) {
      const parts = Time.split(':');
      hours = parseInt(parts[0], 10) || 0;
      minutes = parseInt(parts[1], 10) || 0;
    }
    newDate.setHours(hours, minutes);

    // Verifica se o horário atual está desabilitado na nova data
    const isTimeDisabled = typeof disabled === 'function' ? disabled(newDate) : false;

    if (isTimeDisabled) {
      // Só limpa se realmente estiver desabilitado
      onTimeChange('');
      newDate.setHours(0, 0); // opcional
    }

    onValueChange?.(newDate);
  };

  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        <Button
          disabled={typeof disabledDates === 'boolean' ? disabledDates : false}
          variant={'outline'}
          size={'icon'}
          className={cn('mx-1 flex size-7 items-center justify-center font-normal', !value && 'text-muted-foreground')}
        >
          <CalendarIcon className="size-4" />
          <span className="sr-only">calender</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" sideOffset={8}>
        <div className="flex gap-1">
          <Calendar
            disabled={disabledDates}
            id={'smart-datetime-calendar'}
            className={cn('peer flex justify-end', inputBase, className)}
            selected={value}
            onSelect={handleDateChange}
            autoFocus
            customLocale="pt-BR"
          />
          <TimePicker />
        </div>
      </PopoverContent>
    </Popover>
  );
};

DateTimeLocalInput.displayName = 'DateTimeLocalInput';
