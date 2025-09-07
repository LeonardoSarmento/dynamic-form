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

interface MultiSelectorProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  values: string[];
  onValuesChange: (values: string[]) => void;
  loop?: boolean;
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
  const containerRef = useRef<HTMLDivElement>(null);

  const [state, dispatch] = useReducer(reducer, {
    values,
    inputValue: '',
    open: false,
    activeIndex: -1,
  });

  useEffect(() => {
    onValuesChange(state.values);
  }, [state.values, onValuesChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        dispatch({ type: 'SET_OPEN', payload: false });
        dispatch({ type: 'RESET_ACTIVE' });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const target = inputRef.current;
      if (!target) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (
            (dir === 'rtl' && state.values.length && (state.activeIndex !== -1 || loop)) ||
            (dir !== 'rtl' && target.selectionStart === 0)
          )
            dir === 'rtl' ? dispatch({ type: 'NEXT', loop }) : dispatch({ type: 'PREV', loop });
          break;
        case 'ArrowRight':
          if (
            (dir === 'rtl' && target.selectionStart === 0) ||
            (dir !== 'rtl' && state.values.length && (state.activeIndex !== -1 || loop))
          )
            dir === 'rtl' ? dispatch({ type: 'PREV', loop }) : dispatch({ type: 'NEXT', loop });
          break;
        case 'Backspace':
        case 'Delete':
          if (state.activeIndex !== -1) dispatch({ type: 'TOGGLE_VALUE', payload: state.values[state.activeIndex] });
          else if (target.selectionStart === 0 && state.values.length)
            dispatch({ type: 'TOGGLE_VALUE', payload: state.values[state.values.length - 1] });
          break;
        case 'Enter':
          dispatch({ type: 'SET_OPEN', payload: true });
          break;
        case 'Escape':
          if (state.activeIndex !== -1) dispatch({ type: 'RESET_ACTIVE' });
          else if (state.open) dispatch({ type: 'SET_OPEN', payload: false });
          break;
      }
    },
    [dir, loop, state.activeIndex, state.open, state.values],
  );

  return (
    <MultiSelectContext.Provider value={{ ...state, dispatch, inputRef }}>
      <Command
        ref={containerRef}
        onKeyDown={handleKeyDown}
        className={cn('flex h-fit flex-col overflow-visible bg-transparent', className)}
        dir={dir}
        {...props}
      >
        {children}
      </Command>
    </MultiSelectContext.Provider>
  );
};

interface TriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  disabledTrigger?: boolean;
  itemsShown?: number;
  children?: ReactNode;
}
const MultiSelectorTrigger = forwardRef<HTMLDivElement, TriggerProps>(
  ({ disabledTrigger = false, itemsShown = 3, children, className, ...props }, ref) => {
    const { values, activeIndex, dispatch } = useMultiSelect();
    const mousePreventDefault = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const displayedValues = values.slice(0, itemsShown);

    return (
      <div
        ref={ref}
        onClick={() => dispatch({ type: 'SET_OPEN', payload: true })}
        className={cn(
          'bg-background ring-ring flex min-h-[34px] flex-wrap gap-1 rounded-md p-1 ring-2',
          activeIndex === -1 && 'ring-1 focus-visible:ring-cyan-600',
          className,
        )}
        {...props}
        role="listbox"
        aria-multiselectable="true"
      >
        {displayedValues.map((item, index) => (
          <Badge
            key={item}
            className={cn(
              'border-border flex transform items-center gap-1 rounded-xl border px-2 transition-transform duration-150 hover:scale-105',
              activeIndex === index && 'ring-muted-foreground ring-2',
            )}
            variant="secondary"
          >
            <span className="text-xs">{item}</span>
            {!disabledTrigger && (
              <button
                type="button"
                onMouseDown={mousePreventDefault}
                onClick={() => dispatch({ type: 'TOGGLE_VALUE', payload: item })}
                aria-label={`Remove ${item} option`}
              >
                <RemoveIcon className="hover:stroke-destructive h-4 w-4" />
              </button>
            )}
          </Badge>
        ))}
        {values.length > itemsShown && (
          <Badge variant="secondary" className="rounded-sm px-2 text-xs font-normal">
            +{values.length - itemsShown} selecionado(s)
          </Badge>
        )}
        {children}
      </div>
    );
  },
);
MultiSelectorTrigger.displayName = 'MultiSelectorTrigger';

const MultiSelectorInput = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>>(
  ({ className, ...props }) => {
    const { inputValue, dispatch, inputRef } = useMultiSelect();
    return (
      <CommandPrimitive.Input
        {...props}
        ref={inputRef}
        value={inputValue}
        onValueChange={(val: string) => dispatch({ type: 'SET_INPUT', payload: val })}
        onFocus={() => dispatch({ type: 'SET_OPEN', payload: true })}
        onClick={() => dispatch({ type: 'RESET_ACTIVE' })}
        className={cn('placeholder:text-muted-foreground ml-2 flex-1 bg-transparent text-sm outline-hidden', className)}
      />
    );
  },
);
MultiSelectorInput.displayName = 'MultiSelectorInput';

const MultiSelectorContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children }, ref) => {
  const { open } = useMultiSelect();
  return open ? (
    <div ref={ref} className="relative">
      {children}
    </div>
  ) : null;
});
MultiSelectorContent.displayName = 'MultiSelectorContent';

interface ListProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> {
  itemsCount?: number;
}
const MultiSelectorList = forwardRef<HTMLDivElement, ListProps>(({ className, children, itemsCount }, ref) => {
  const { values, dispatch, inputValue } = useMultiSelect();

  const filteredChildren = React.Children.toArray(children).filter(
    (child: any) => !inputValue || child.props.value.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const selectableChildren = filteredChildren.filter((child: any) => !child.props.disabled);

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
        'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground dark:scrollbar-thumb-muted scrollbar-thumb-rounded-lg border-border bg-background absolute top-0 z-10 mt-2 flex max-h-60 w-full flex-col gap-2 overflow-auto rounded-md border p-2 shadow-md transition-colors',
        className,
      )}
    >
      {itemsCount && itemsCount > 5 && selectableChildren.length > 0 && (
        <div className="bg-background sticky top-0 z-20 mb-1 flex items-center justify-between p-1">
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
          <span className="text-muted-foreground">Nenhum resultado encontrado.</span>
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

export {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
};
