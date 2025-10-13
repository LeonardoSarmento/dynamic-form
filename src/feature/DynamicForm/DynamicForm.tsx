import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { CalendarIcon, Check, ChevronsUpDown, Paperclip, Trash2, Upload } from 'lucide-react';
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
import { ScrollArea } from './components/ui/scroll-area';
import { DynamicFormType } from './types/DynamicFormType';
import { applyCNPJMask } from './types/schemas/CNPJ';
import { applyPhoneMask } from './types/schemas/Phone';
import { applyMacAddressMask } from './types/schemas/MacAddress';
import { applyIPMask } from './types/schemas/Ip';
import { applyCPFMask } from './types/schemas/Cpf';
import { BaseInputT } from './types/formField';
import { HyperlinkInput } from './components/extensions/hyperlink';
import { applyCurrencyMask } from './types/schemas/Currency';
import { HierarchicalCheckbox } from './components/extensions/hierarchical-checkbox';
import { useCallback } from 'react';
import { TooltipComponentProvider } from './components/ui/tooltip';
import { SmartDatetimeInput } from './components/extensions/smart-datetime-input';
import { Slider } from './components/ui/slider';

export default function DynamicForm<TFieldValues extends FieldValues>({
  hint,
  ...props
}: DynamicFormType<TFieldValues> & { hint?: string }) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col space-y-0.5', props.classnameitem)}>
          {props.hidelabel ? null : (
            <FormLabel className={cn('mb-1', props.type === 'checkbox' && 'text-center', props.classnamelabel)}>
              {props.label}
            </FormLabel>
          )}
          {DynamicComponent({ field, hint, ...props })}
          {props.hidedescription ? null : (
            <FormDescription className={props.classnamedescription}>{props.description}</FormDescription>
          )}
          {props.hideerrormessage ? null : <FormMessage className={props.classnamemessage} />}
        </FormItem>
      )}
    />
  );
}

function DynamicComponent<TFieldValues extends FieldValues>({
  hint,
  ...props
}: DynamicFormType<TFieldValues> & {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  hint?: string;
  format?: 'short' | 'long';
  customLocale?: string;
}) {
  const dateFormatter = useCallback(
    (date: Date) =>
      intlFormat(
        date,
        props.type === 'date' && props.format === 'long'
          ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
          : { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' },
        { locale: props.type === 'date' ? props.customLocale || 'pt-BR' : 'pt-BR' },
      ),
    [props.type, props.format, props.customLocale],
  );

  const maskInput = useCallback((mask: BaseInputT['mask'], value: string) => {
    if (mask === 'cnpj') return applyCNPJMask(value);
    if (mask === 'cpf') return applyCPFMask(value);
    if (mask === 'phone') return applyPhoneMask(value);
    if (mask === 'ip') return applyIPMask(value);
    if (mask === 'macAddress') return applyMacAddressMask(value);
    if (mask === 'currency') return applyCurrencyMask(value);
    if (typeof mask === 'function') return mask(value);
    return value;
  }, []);

  const handleCheckboxChange = useCallback(
    (field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>, id: string, checked: boolean) => {
      field.onChange(checked ? [...(field.value || []), id] : field.value?.filter((v: string) => v !== id));
    },
    [],
  );

  switch (props.type) {
    case 'password':
      return <InputPassword {...props} {...props.field} type="password" />;
    case 'number':
      return (
        <FormControl>
          <Input
            {...props}
            {...props.field}
            type="number"
            min={0}
            step=".01"
            hint={hint}
            onChange={(e) => props.field.onChange(Number(e.target.value))}
          />
        </FormControl>
      );
    case 'textarea':
      return (
        <FormControl>
          <AutosizeTextarea {...props} {...props.field} className={cn('resize-none', props.className)} />
        </FormControl>
      );
    case 'date':
      return (
        <Popover>
          <PopoverTrigger asChild disabled={props.disabledInput}>
            <FormControl>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full pl-3 text-left font-normal',
                  props.mode === 'single'
                    ? !props.field.value && 'text-muted-foreground'
                    : !props.field.value?.from && !props.field.value?.to && 'text-muted-foreground',
                  props.className,
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
      );
    case 'datetime-input': {
      return (
        <FormControl>
          <SmartDatetimeInput {...props} {...props.field} onValueChange={props.field.onChange} />
        </FormControl>
      );
    }
    case 'slider': {
      const value = props.field.value ?? [0];
      const isRange = value.length === 2;
      return (
        <div className="flex w-full min-w-40 flex-col gap-2">
          {isRange ? (
            <div className="flex items-center justify-between text-sm">
              <div className="flex flex-col">
                <FormLabel htmlFor={props.name}>{props.titles?.[0]}</FormLabel>
                <span className="text-muted-foreground space-x-1">
                  {value[0]} {props.unit}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <FormLabel htmlFor={props.name}>{props.titles?.[1]}</FormLabel>
                <span className="text-muted-foreground space-x-1">
                  {value[1]} {props.unit}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <FormLabel htmlFor={props.name}>{props.titles?.[0]}</FormLabel>
              <span className="text-muted-foreground space-x-1 text-sm">
                {value[0]} {props.unit}
              </span>
            </div>
          )}
          <FormControl>
            <Slider
              {...props}
              defaultValue={props.field.value}
              onValueChange={props.field.onChange}
              max={props.max ?? 100}
              min={props.min ?? 0}
              step={props.step ?? 1}
              className={cn('flex w-full', props.className)}
            />
          </FormControl>
        </div>
      );
    }
    case 'switch': {
      const { type, ...switchRest } = props;
      return (
        <FormControl>
          <Switch {...switchRest} checked={props.field.value} onCheckedChange={props.field.onChange} />
        </FormControl>
      );
    }
    case 'select': {
      const { type, ...selectRest } = props;
      return (
        <Select onValueChange={props.field.onChange} defaultValue={props.field.value}>
          <FormControl>
            <SelectTrigger {...selectRest}>
              <SelectValue placeholder={props.placeholder ?? 'Selecione uma das opções'} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {props.selectoptions?.map((item) => (
              <SelectItem key={item.id} value={item.id} disabled={item.disabled}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    case 'multi-select': {
      const { type, disabledTrigger, itensShown, ...multiSelectRest } = props;
      return (
        <MultiSelector onValuesChange={props.field.onChange} values={props.field.value}>
          <MultiSelectorTrigger
            disabledTrigger={disabledTrigger || props.disabled}
            placeholder={props.placeholder ?? 'Selecione suas opções'}
            itemsShown={itensShown}
            itemscount={props.multiselectoptions.filter((item) => !item.disabled).length}
          />
          <MultiSelectorContent>
            <MultiSelectorInput {...multiSelectRest} />
            <MultiSelectorList itemsCount={props.multiselectoptions.length}>
              {props.multiselectoptions?.map((item) => (
                <MultiSelectorItem key={item.id} value={item.label} disabled={item.disabled}>
                  <span>{item.label}</span>
                </MultiSelectorItem>
              ))}
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector>
      );
    }
    case 'checkbox': {
      const { type, ...checkboxRest } = props;
      return (
        <>
          {props.checkboxoptions?.map((item) => (
            <FormField
              key={item.id}
              control={props.control}
              name={props.name}
              render={({ field }) => {
                return (
                  <FormItem key={item.id} className="mx-auto flex flex-row items-center space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        {...checkboxRest}
                        disabled={props.disabled ? true : item.disabled}
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked: boolean | 'indeterminate') =>
                          handleCheckboxChange(field, item.id, checked === true)
                        }
                      />
                    </FormControl>
                    <FormLabel
                      className={cn(`cursor-pointer text-sm font-normal`, item.disabled ? 'text-muted-foreground' : '')}
                    >
                      {item.label}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
        </>
      );
    }
    case 'radio':
      return (
        <FormControl>
          <RadioGroup
            {...props}
            onValueChange={props.field.onChange}
            defaultValue={props.field.value}
            className={cn('flex flex-col space-y-1', props.className)}
          >
            {props.radiooptions.map((item) => (
              <FormItem key={item.id} className="flex items-center space-y-0 space-x-3">
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
      );
    case 'combobox': {
      const { type, handlecustomselect, ...comboboxRest } = props;
      return (
        <Popover modal={false}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                {...comboboxRest}
                variant="outline"
                role="combobox"
                className={cn(
                  `h-9 justify-between text-sm ${!props.field.value && 'text-muted-foreground font-normal'}`,
                  props.className,
                )}
              >
                {props.field.value
                  ? props.comboboxoptions.find((item) => item.id === props.field.value)?.label
                  : (props.placeholder ?? 'Selecione uma opção')}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Procure aqui" className="h-9" />
              <CommandList>
                <CommandEmpty>{props.optionsnotfoundtext ?? 'Opção não encontrada'}</CommandEmpty>
                <CommandGroup>
                  {props.comboboxoptions.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.label}
                      disabled={item.disabled}
                      className={props.classNameCommandItem}
                      onSelect={(value) => {
                        handlecustomselect?.(value);
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
      );
    }
    case 'file-upload':
      const { reSelect, ...rest } = props;
      return (
        <FileUploader
          value={props.field.value}
          onValueChange={props.field.onChange}
          dropzoneOptions={props.dropzone}
          reSelect={reSelect}
          className={props.className}
        >
          <FileInput
            {...rest}
            className={cn(
              'hover:border-primary flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors',
              props.disabled && 'cursor-not-allowed opacity-40',
            )}
          >
            <Upload className="text-muted-foreground h-8 w-8" />
            <span className="text-muted-foreground mt-2 text-sm">Arraste arquivos ou clique para selecionar</span>
          </FileInput>
          {props.field.value && props.field.value.length > 0 && (
            <div className="mt-1 space-y-1">
              <ScrollArea
                className={cn(
                  'max-h-32 max-w-full min-w-fit rounded-md border p-2',
                  `h-[${props.field.value.length * 9}px] overflow-y-auto`,
                )}
              >
                <FileUploaderContent>
                  {props.field.value.map((file: File, i: number) => (
                    <TooltipComponentProvider key={i} tooltipContent={file.name}>
                      <FileUploaderItem index={i}>
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="size-6 rounded object-cover"
                          />
                        ) : (
                          <Paperclip className="size-4 stroke-current" />
                        )}
                        <span className="max-w-2xs truncate text-sm">{file.name}</span>
                      </FileUploaderItem>
                    </TooltipComponentProvider>
                  ))}
                </FileUploaderContent>
              </ScrollArea>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => props.field.onChange([])}
                className="flex items-center gap-1"
              >
                <span className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors">
                  <Trash2 className="size-4" />
                </span>
                Remover todos
              </Button>
            </div>
          )}
        </FileUploader>
      );
    case 'link': {
      const { mask, ...linkRest } = props;
      return (
        <FormControl>
          <HyperlinkInput
            {...linkRest}
            onChange={(e) => props.field.onChange(maskInput(props.mask, e.target.value))}
            hint={hint}
          />
        </FormControl>
      );
    }
    case 'hierarchical': {
      return (
        <FormControl>
          <HierarchicalCheckbox {...props} {...props.field} />
        </FormControl>
      );
    }

    default: {
      const { mask, ...inputRest } = props;
      return (
        <FormControl>
          <Input
            {...inputRest}
            {...inputRest.field}
            maxLength={mask === 'phone' ? 15 : undefined}
            onChange={(e) => props.field.onChange(maskInput(props.mask, e.target.value))}
            hint={hint}
          />
        </FormControl>
      );
    }
  }
}
