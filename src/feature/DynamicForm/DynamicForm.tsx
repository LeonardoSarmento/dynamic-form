import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { CalendarIcon, Check, ChevronsUpDown, Paperclip } from 'lucide-react';
import { DropzoneOptions } from 'react-dropzone';
import { intlFormat } from 'date-fns';
import { cn } from './lib/utils';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './components/ui/form';
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from './components/extensions/multi-select';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from './components/extensions/file-uploader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import { Input, InputPassword } from './components/ui/input';
import { AutosizeTextarea } from './components/ui/autosize-textarea';
import { Checkbox } from './components/ui/checkbox';
import { Calendar } from './components/ui/calendar';
import { Button } from './components/ui/button';
import { Switch } from './components/ui/switch';
import { DynamicFormType } from './types/DynamicFormType';
import { applyCNPJMask } from './types/schemas/CNPJ';
import { applyPhoneMask } from './types/schemas/Phone';
import { applyMacAddressMask } from './types/schemas/MacAddress';
import { applyIPMask } from './types/schemas/Ip';
import { applyCPFMask } from './types/schemas/Cpf';
import { BaseInputT } from './types/formField';

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="mb-3 h-8 w-8 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Arraste seu arquivo</span>
        &nbsp; ou clique para selecionar
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">formato permitido: .CSV</p>
    </>
  );
};

const dropzone = {
  accept: {
    'image/*': ['.jpg', '.jpeg', '.png'],
    'text/csv': ['.csv'],
    'application/vnd.ms-excel': ['.csv'],
  },
  multiple: false,
  maxFiles: 5,
  maxSize: 20 * 1024 * 1024,
} satisfies DropzoneOptions;

export default function DynamicForm<TFieldValues extends FieldValues>({
  hint,
  ...props
}: DynamicFormType<TFieldValues> & { hint?: string }) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col space-y-0.5', props.classNameItem)}>
          {props.hideLabel ? null : <FormLabel className="mb-1">{props.label}</FormLabel>}
          {DynamicComponent({ field, hint, ...props })}
          {props.hideDescription ? null : <FormDescription>{props.description}</FormDescription>}
          {props.hideErrorMessage ? null : <FormMessage className={props.classNameMessage} />}
        </FormItem>
      )}
    />
  );
}

function DynamicComponent<TFieldValues extends FieldValues>({
  hint,
  ...props
}: DynamicFormType<TFieldValues> & { field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>; hint?: string }) {
  function dateFormatter(date: Date) {
    return intlFormat(
      date,
      props.type === 'date' && props.format === 'long'
        ? {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        : {
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          },
      {
        locale: props.type === 'date' ? props.customLocale || 'pt-BR' : 'pt-BR',
      },
    );
  }
  switch (props.type) {
    case 'password':
      return (
        <InputPassword
          {...props}
          className={props.className}
          placeholder={props.placeholder}
          type="password"
          {...props.field}
        />
      );
    case 'number':
      return (
        <FormControl>
          <Input
            {...props}
            type="number"
            min={0}
            step=".01"
            className={props.className}
            placeholder={props.placeholder}
            hint={hint}
            {...props.field}
            onChange={(e) => props.field.onChange(Number(e.target.value))}
          />
        </FormControl>
      );
    case 'textarea':
      return (
        <FormControl>
          <AutosizeTextarea
            {...props}
            className={cn('resize-none', props.className)}
            placeholder={props.placeholder}
            {...props.field}
          />
        </FormControl>
      );
    case 'date':
      return (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    props.mode === 'single'
                      ? !props.field.value && 'text-muted-foreground'
                      : !props.field.value?.from && !props.field.value?.to && 'text-muted-foreground',
                  )}
                >
                  {props.mode === 'single' ? (
                    props.field.value ? (
                      dateFormatter(props.field.value)
                    ) : (
                      <span>{props.placeholder ?? 'Escolha uma data'}</span>
                    )
                  ) : props.field.value?.from ? (
                    props.field.value.to ? (
                      `${dateFormatter(props.field.value.from)} - ${dateFormatter(props.field.value.to)}`
                    ) : (
                      dateFormatter(props.field.value.from)
                    )
                  ) : (
                    <span>{props.placeholder ?? 'Escolha um período'}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                {...props}
                autoFocus
                customMode={props.mode || 'single'}
                customLocale={props.customLocale || 'pt-BR'}
                selected={props.field.value}
                numberOfMonths={props.mode === 'range' ? 2 : 1}
                disabled={{
                  after: new Date(),
                  ...(typeof props.disabled === 'object' && props.disabled ? props.disabled : {}),
                }}
                onSelect={props.field.onChange}
              />
            </PopoverContent>
          </Popover>
        </>
      );
    case 'switch':
      const { type: switchType, ...switchRest } = props;
      return (
        <>
          <FormControl>
            <Switch {...switchRest} checked={props.field.value} onCheckedChange={props.field.onChange} aria-readonly />
          </FormControl>
        </>
      );
    case 'select':
      const { type: selectType, ...selectRest } = props;
      return (
        <>
          <Select onValueChange={props.field.onChange} defaultValue={props.field.value}>
            <FormControl>
              <SelectTrigger {...selectRest}>
                <SelectValue placeholder={props.placeholder ?? 'Selecione uma das opções'} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {props.selectOptions?.map((item) => (
                <SelectItem key={item.id} value={item.id} disabled={item.disabled}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      );
    case 'multi-select':
      const { type: multiSelectType, ...multiSelectRest } = props;
      return (
        <>
          <MultiSelector onValuesChange={props.field.onChange} values={props.field.value}>
            <MultiSelectorTrigger>
              <MultiSelectorInput {...multiSelectRest} placeholder={props.placeholder ?? 'Selecione suas opções'} />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {props.multiSelectOptions?.map((item) => (
                  <MultiSelectorItem key={item.id} value={item.label} disabled={item.disabled}>
                    <span>{item.label}</span>
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
        </>
      );
    case 'checkbox':
      const { type: checkboxType, ...checkboxRest } = props;
      return (
        <>
          {props.checkboxOptions?.map((item) => (
            <FormField
              key={item.id}
              control={props.control}
              name={props.name}
              render={({ field }) => {
                return (
                  <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        {...checkboxRest}
                        disabled={props.disabled ? true : item.disabled}
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item.id])
                            : field.onChange(field.value?.filter((value: string) => value !== item.id));
                        }}
                      />
                    </FormControl>
                    <FormLabel className={cn(`text-sm font-normal`, item.disabled ? 'text-muted-foreground' : '')}>
                      {item.label}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
        </>
      );
    case 'radio':
      return (
        <>
          <FormControl>
            <RadioGroup
              {...props}
              onValueChange={props.field.onChange}
              defaultValue={props.field.value}
              className={cn('flex flex-col space-y-1', props.className)}
            >
              {props.radioOptions.map((item) => (
                <FormItem key={item.id} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={item.id} disabled={item.disabled} />
                  </FormControl>
                  <FormLabel className={`${item.disabled ? 'text-muted-foreground' : 'text-primary'} font-normal`}>
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </>
      );
    case 'combobox':
      const { type: comboboxType, ...comboboxRest } = props;
      return (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  {...comboboxRest}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    `h-9 w-[200px] justify-between text-sm ${!props.field.value && 'font-normal text-muted-foreground'}`,
                    props.className,
                  )}
                >
                  {props.field.value
                    ? props.comboboxOptions.find((item) => item.id === props.field.value)?.label
                    : (props.placeholder ?? 'Selecione uma opção')}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Procure aqui" className="h-9" />
                <CommandList>
                  <CommandEmpty>Opção não encontrada</CommandEmpty>
                  <CommandGroup>
                    {props.comboboxOptions.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.label}
                        disabled={item.disabled}
                        className={props.classNameCommandItem}
                        onSelect={(value) => {
                          props.onCustomSelect?.(value);
                          props.field.onChange(item.id);
                        }}
                      >
                        {item.label}
                        <Check className={cn('ml-auto', item.id === props.field.value ? 'opacity-100' : 'opacity-0')} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </>
      );
    case 'file-upload':
      return (
        <>
          <FileUploader
            value={props.field.value}
            onValueChange={props.field.onChange}
            dropzoneOptions={{ ...dropzone, ...props.dropzone }}
            reSelect={true}
            className={props.className}
          >
            <FileInput
              {...props}
              className={cn('outline-dashed outline-1 outline-white', props.disabled ? 'opacity-40' : 'opacity-100')}
            >
              <div className="flex w-full flex-col items-center justify-center pb-4 pt-3">
                <FileSvgDraw />
              </div>
            </FileInput>
            {props.field.value && props.field.value.length > 0 && (
              <FileUploaderContent>
                {props.field.value.map((file: File, i: number) => (
                  <FileUploaderItem key={i} index={i}>
                    <Paperclip className="h-4 w-4 stroke-current" />
                    <span>{file.name}</span>
                  </FileUploaderItem>
                ))}
              </FileUploaderContent>
            )}
          </FileUploader>
        </>
      );
    default:
      return (
        <>
          <FormControl>
            <Input
              {...props}
              {...props.field}
              className={props.className}
              placeholder={props.placeholder}
              maxLength={
                props.mask === 'phone' || props.mask === 'ip' ? 15 : props.mask === 'macAddress' ? 17 : undefined
              }
              onChange={(e) => {
                const { value } = e.target;
                if (props.mask) {
                  e.target.value = applyMaskToInput(props.mask, value);
                }
                props.field.onChange(e);
              }}
              hint={hint}
            />
          </FormControl>
        </>
      );
  }
}

function applyMaskToInput(mask: BaseInputT['mask'], value: string) {
  if (mask === 'cnpj') {
    return applyCNPJMask(value);
  } else if (mask === 'cpf') {
    return applyCPFMask(value);
  } else if (mask === 'phone') {
    return applyPhoneMask(value);
  } else if (mask === 'ip') {
    return applyIPMask(value);
  } else if (mask === 'macAddress') {
    return applyMacAddressMask(value);
  } else if (typeof mask === 'function') {
    return mask(value);
  }
  // If mask is undefined or does not match any condition
  return value;
}
