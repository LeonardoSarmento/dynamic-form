'use client';

import React, {
  createContext,
  forwardRef,
  useContext,
  useReducer,
  useRef,
  useCallback,
  ReactNode,
  KeyboardEvent,
  useEffect,
} from 'react';
import { Badge } from '../ui/badge';
import { Command, CommandItem, CommandEmpty, CommandList } from '../ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { X as RemoveIcon, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import { NoOptions } from './no-options';

type MultiSelectOptionsType = {
  id: string;
  label: string;
  disabled?: boolean | undefined;
}[];

interface MultiSelectorProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  values: string[];
  onValuesChange: (values: string[]) => void;
  loop?: boolean;
  options?: MultiSelectOptionsType;
  children?: ReactNode;
}

interface MultiSelectState {
  values: string[];
  inputValue: string;
  open: boolean;
  activeIndex: number;
}

type MultiSelectAction =
  | { type: 'TOGGLE_VALUE'; payload: string }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_ACTIVE_INDEX'; payload: number }
  | { type: 'NEXT'; loop: boolean }
  | { type: 'PREV'; loop: boolean }
  | { type: 'RESET_ACTIVE' };

interface MultiSelectContextProps extends MultiSelectState {
  dispatch: React.Dispatch<MultiSelectAction>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null);
const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) throw new Error('useMultiSelect must be used within MultiSelector');
  return context;
};

const reducer = (state: MultiSelectState, action: MultiSelectAction): MultiSelectState => {
  switch (action.type) {
    case 'TOGGLE_VALUE':
      return {
        ...state,
        values: state.values.includes(action.payload)
          ? state.values.filter((v) => v !== action.payload)
          : [...state.values, action.payload],
      };
    case 'SET_INPUT':
      return { ...state, inputValue: action.payload };
    case 'SET_OPEN':
      return { ...state, open: action.payload };
    case 'SET_ACTIVE_INDEX':
      return { ...state, activeIndex: action.payload };
    case 'NEXT':
      return {
        ...state,
        activeIndex:
          state.activeIndex + 1 > state.values.length - 1
            ? action.loop
              ? 0
              : state.activeIndex
            : state.activeIndex + 1,
      };
    case 'PREV':
      return {
        ...state,
        activeIndex:
          state.activeIndex - 1 < 0
            ? action.loop
              ? state.values.length - 1
              : state.activeIndex
            : state.activeIndex - 1,
      };
    case 'RESET_ACTIVE':
      return { ...state, activeIndex: -1 };
    default:
      return state;
  }
};

const MultiSelector = ({
  values,
  onValuesChange,
  loop = false,
  className,
  children,
  dir,
  ...props
}: MultiSelectorProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [state, dispatch] = useReducer(reducer, {
    values,
    inputValue: '',
    open: false,
    activeIndex: -1,
  });

  useEffect(() => {
    onValuesChange(state.values);
  }, [state.values, onValuesChange]);

  const handleOpenChange = (open: boolean) => {
    dispatch({ type: 'SET_OPEN', payload: open });
    if (!open) dispatch({ type: 'RESET_ACTIVE' });
  };

  return (
    <MultiSelectContext.Provider {...props} value={{ ...state, dispatch, inputRef }}>
      <Popover open={state.open} onOpenChange={handleOpenChange}>
        {children}
      </Popover>
    </MultiSelectContext.Provider>
  );
};

interface TriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  disabledTrigger?: boolean;
  itemsShown?: number;
  itemscount?: number;
  children?: ReactNode;
  placeholder?: string;
}
const MultiSelectorTrigger = forwardRef<HTMLButtonElement, TriggerProps & { options?: MultiSelectOptionsType }>(
  ({ disabledTrigger = false, itemsShown = 3, children, options, className, ...props }, ref) => {
    const { values, activeIndex, dispatch } = useMultiSelect();
    const mousePreventDefault = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const displayedValues = values.slice(0, itemsShown);

    return (
      <PopoverTrigger asChild>
        <Button
          {...props}
          ref={ref}
          variant="outline"
          className={cn(
            'text-muted-foreground flex h-auto min-h-9 w-full flex-wrap justify-start gap-1 p-2',
            activeIndex === -1 && 'focus-visible:ring-cyan-600',
            className,
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch({ type: 'SET_OPEN', payload: true });
          }}
          role="listbox"
          aria-multiselectable="true"
        >
          {displayedValues.map((id, index) => (
            <React.Fragment key={index}>
              <Badge
                key={id}
                className={cn(
                  'border-border flex transform items-center gap-1 rounded-xl border px-2 transition-transform duration-150 hover:scale-105',
                  activeIndex === index && 'ring-muted-foreground ring-2',
                )}
                variant="secondary"
              >
                <span className="text-xs">{options?.find((o) => o.id === id)?.label || id}</span>
                {!disabledTrigger && (
                  <div
                    role="button"
                    onMouseDown={mousePreventDefault}
                    onClick={() => dispatch({ type: 'TOGGLE_VALUE', payload: id })}
                    aria-label={`Remove ${id} option`}
                    aria-roledescription="button to remove option"
                    className="ml-1"
                  >
                    <span className="sr-only">Remove {id} option</span>
                    <span className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors">
                      <RemoveIcon className="h-4 w-4 stroke-current" />
                    </span>
                  </div>
                )}
              </Badge>
            </React.Fragment>
          ))}
          {values.length > itemsShown && (
            <Badge variant="secondary" className="rounded-sm px-2 text-xs font-normal">
              +{values.length - itemsShown} selecionado(s)
            </Badge>
          )}
          {values.length < (props.itemscount ?? 0) && (
            <span className="text-muted-foreground">{props.placeholder}</span>
          )}
          {children}
        </Button>
      </PopoverTrigger>
    );
  },
);
MultiSelectorTrigger.displayName = 'MultiSelectorTrigger';

const MultiSelectorInput = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>>(
  ({ className, placeholder = 'Procure aqui', ...props }, ref) => {
    const { inputValue, dispatch } = useMultiSelect();
    return (
      <div className="flex items-center px-3" cmdk-input-wrapper="">
        <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandPrimitive.Input
          {...props}
          ref={ref}
          value={inputValue}
          placeholder={placeholder}
          onValueChange={(val: string) => dispatch({ type: 'SET_INPUT', payload: val })}
          onFocus={() => dispatch({ type: 'SET_OPEN', payload: true })}
          onClick={() => dispatch({ type: 'RESET_ACTIVE' })}
          className={cn(
            'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        />
      </div>
    );
  },
);
MultiSelectorInput.displayName = 'MultiSelectorInput';

interface ListProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> {
  itemsCount?: number;
}
const MultiSelectorList = forwardRef<HTMLDivElement, ListProps>(({ className, children, itemsCount }, ref) => {
  const { values, dispatch, inputValue } = useMultiSelect();

  const filteredChildren = React.Children.toArray(children).filter(
    (child: any) => !inputValue || (child.props?.value || '').toLowerCase().includes(inputValue.toLowerCase()),
  );

  const selectableChildren = filteredChildren.filter((child: any) => !child.props?.disabled);

  const allSelectableSelected =
    selectableChildren.length > 0 && selectableChildren.every((child: any) => values.includes(child.props.value));

  const handleToggleAll = () => {
    if (allSelectableSelected) {
      selectableChildren.forEach((child: any) => {
        if (values.includes(child.props.value)) dispatch({ type: 'TOGGLE_VALUE', payload: child.props.value });
      });
    } else {
      selectableChildren.forEach((child: any) => {
        if (!values.includes(child.props.value)) dispatch({ type: 'TOGGLE_VALUE', payload: child.props.value });
      });
    }
  };

  return (
    <CommandList
      ref={ref}
      className={cn(
        'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground dark:scrollbar-thumb-muted scrollbar-thumb-rounded-lg border-border bg-background z-10 flex max-h-60 w-full min-w-full flex-col gap-2 overflow-auto rounded-b-md border p-2 shadow-md transition-colors',
        className,
      )}
    >
      {itemsCount && itemsCount > 5 && selectableChildren.length > 0 && (
        <div className="bg-background sticky top-0 z-20 mb-1 flex items-center justify-between space-x-2 p-1">
          <button
            type="button"
            onClick={handleToggleAll}
            className={cn(
              'rounded-md px-2 py-1 text-xs font-medium transition-colors',
              allSelectableSelected
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/80'
                : 'bg-primary text-primary-foreground hover:bg-primary/80',
            )}
          >
            {allSelectableSelected ? 'Limpar todos' : 'Selecionar todos'}
          </button>

          {values.length > 0 && itemsCount && (
            <Badge variant="secondary" className="rounded-sm px-2 text-xs font-normal">
              {values.length} de {itemsCount} selecionados
            </Badge>
          )}
        </div>
      )}

      {filteredChildren.length > 0 ? (
        filteredChildren
      ) : (
        <CommandEmpty>
          <NoOptions />
          {/* <span className="text-muted-foreground">Nenhum resultado encontrado.</span> */}
        </CommandEmpty>
      )}
    </CommandList>
  );
});
MultiSelectorList.displayName = 'MultiSelectorList';

interface ItemProps {
  value: string;
  children: ReactNode;
}
const MultiSelectorItem = forwardRef<
  HTMLDivElement,
  ItemProps & React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ value, children, className, ...props }, ref) => {
  const { values, dispatch } = useMultiSelect();
  const isSelected = values.includes(value);

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleSelect = () => {
    if (!props.disabled) {
      dispatch({ type: 'TOGGLE_VALUE', payload: value });
    }
  };

  return (
    <CommandItem
      ref={ref}
      {...props}
      onSelect={handleSelect}
      onMouseDown={mousePreventDefault}
      className={cn(
        'flex cursor-pointer justify-between rounded-md px-2 py-1 transition-colors',
        props.disabled && 'bg-muted text-destructive line-through opacity-40',
        className,
      )}
      aria-checked={isSelected}
      aria-disabled={props.disabled}
      role="option"
    >
      {children}

      {props.disabled && <X className="text-destructive h-4 w-4" />}
      {isSelected && <Check className="text-primary h-4 w-4" />}
    </CommandItem>
  );
});
MultiSelectorItem.displayName = 'MultiSelectorItem';

const MultiSelectorContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    const { open, dispatch, inputRef } = useMultiSelect();

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const target = inputRef.current;
        if (!target) return;

        switch ((e as any).key) {
          case 'ArrowLeft':
            dispatch({ type: 'PREV', loop: false });
            break;
          case 'ArrowRight':
            dispatch({ type: 'NEXT', loop: false });
            break;
          case 'Backspace':
          case 'Delete':
            if ((dispatch as any) && (e as any).target === target) {
              if ((dispatch as any) && inputRef.current && target.selectionStart === 0) {
                // remove last selected
                dispatch({ type: 'TOGGLE_VALUE', payload: '' });
              }
            }
            break;
          case 'Escape':
            dispatch({ type: 'SET_OPEN', payload: false });
            break;
        }
      },
      [dispatch, inputRef],
    );

    const childrenArray = React.Children.toArray(children) as React.ReactElement[];
    const isInput = (c: React.ReactElement) =>
      c && (c.type === MultiSelectorInput || (c.type as any)?.displayName === 'MultiSelectorInput');
    const isList = (c: React.ReactElement) =>
      c && (c.type === MultiSelectorList || (c.type as any)?.displayName === 'MultiSelectorList');

    const inputChild = childrenArray.find(isInput) ?? null;
    const listChild = childrenArray.find(isList) ?? null;
    const otherChildren = childrenArray.filter((c) => c !== inputChild && c !== listChild);

    if (!open) return null;

    return (
      <PopoverContent ref={ref} align="center" className="w-full p-0" {...props}>
        <div onKeyDown={handleKeyDown}>
          <Command>
            {inputChild}
            {otherChildren}
            {listChild}
          </Command>
        </div>
      </PopoverContent>
    );
  },
);
MultiSelectorContent.displayName = 'MultiSelectorContent';

export {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
};
