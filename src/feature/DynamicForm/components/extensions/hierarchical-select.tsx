import React, { useState, forwardRef } from 'react';
import { Check, ChevronRight, ChevronsUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '../../lib/utils';

export type HierarchicalOption = {
  id: string;
  label: string;
  disabled?: boolean;
  children?: HierarchicalOption[];
};

export type HierarchicalSelectProps = {
  options: HierarchicalOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  className?: string;
  maxDisplayItems?: number;
  disabled?: boolean;
  maxSelected?: number;
};

export const HierarchicalSelect = forwardRef<HTMLButtonElement, HierarchicalSelectProps>(
  (
    {
      options,
      value = [],
      onChange,
      placeholder = 'Selecione...',
      emptyMessage = 'Sem resultados.',
      searchPlaceholder = 'Filtrar opções...',
      className,
      maxDisplayItems = 5,
      disabled,
      maxSelected,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const selectedValues = value;

    const updateSelectedValues = (values: string[]) => {
      if (onChange) onChange(values);
    };

    const initializeExpandedState = (options: HierarchicalOption[]): Record<string, boolean> => {
      const expanded: Record<string, boolean> = {};
      const processOption = (option: HierarchicalOption) => {
        if (option.children) {
          expanded[option.id] = false;
          option.children.forEach(processOption);
        }
      };
      options.forEach(processOption);
      return expanded;
    };

    const [expanded, setExpanded] = useState<Record<string, boolean>>(() => initializeExpandedState(options));

    const toggleExpand = (value: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setExpanded((prev) => ({
        ...prev,
        [value]: !prev[value],
      }));
    };

    const getLeafValues = (option: HierarchicalOption): string[] => {
      if (!option.children || option.children.length === 0) {
        return option.disabled ? [] : [option.id];
      }

      const childValues = option.children.flatMap(getLeafValues);
      return childValues.length > 0 ? childValues : [];
    };

    const isPartiallySelected = (option: HierarchicalOption): boolean => {
      if (!option.children) return false;
      const leafValues = getLeafValues(option);
      return (
        leafValues.some((value) => selectedValues.includes(value)) &&
        !leafValues.every((value) => selectedValues.includes(value))
      );
    };

    const isFullySelected = (option: HierarchicalOption): boolean => {
      const leafValues = getLeafValues(option);
      return leafValues.length > 0 && leafValues.every((value) => selectedValues.includes(value));
    };

    const handleSelect = (option: HierarchicalOption) => {
      if (option.disabled) return;

      const leafValues = getLeafValues(option);
      if (leafValues.length === 0) return;

      if (isFullySelected(option)) {
        const newValues = selectedValues.filter((value) => !leafValues.includes(value));
        updateSelectedValues(newValues);
      } else {
        const newValues = [...new Set([...selectedValues, ...leafValues])];
        if (!maxSelected || newValues.length <= maxSelected) {
          updateSelectedValues(newValues);
        }
      }
    };

    const getSelectedLabels = (): string[] => {
      const findLabel = (value: string, options: HierarchicalOption[]): string | undefined => {
        for (const option of options) {
          if (option.id === value && (!option.children || option.children.length === 0)) return option.label;
          if (option.children) {
            const childLabel = findLabel(value, option.children);
            if (childLabel) return childLabel;
          }
        }
        return undefined;
      };
      return selectedValues.map((value) => findLabel(value, options)).filter(Boolean) as string[];
    };

    const getButtonText = () => {
      if (selectedValues.length === 0) return placeholder;
      const selectedLabels = getSelectedLabels();
      if (selectedLabels.length <= maxDisplayItems) return selectedLabels.join(', ');
      return `${selectedLabels.slice(0, maxDisplayItems).join(', ')} +${selectedLabels.length - maxDisplayItems}`;
    };

    const renderOption = (option: HierarchicalOption, depth = 0) => {
      const isSelected = isFullySelected(option);
      const isPartial = isPartiallySelected(option);
      const isExpandable = option.children && option.children.length > 0;
      const isItemExpanded = expanded[option.id];

      const reachedMax = maxSelected !== undefined && selectedValues.length >= maxSelected && !isSelected;
      const isDisabled = option.disabled || reachedMax;

      return (
        <div key={option.id}>
          <CommandItem
            value={option.id}
            onSelect={() => {
              if (!isExpandable && !isDisabled) handleSelect(option);
            }}
            className={cn('flex items-center gap-2', isDisabled && 'cursor-not-allowed opacity-50')}
            style={{ paddingLeft: depth > 0 ? `${depth * 1.5}rem` : undefined }}
          >
            <div
              className={cn(
                'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                isSelected && 'bg-primary border-primary',
                isPartial && 'bg-primary/50 border-primary/50',
                !isSelected && !isPartial && 'border-input',
                isDisabled && 'bg-muted cursor-not-allowed',
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) handleSelect(option);
              }}
            >
              {isSelected && <Check className="text-primary-foreground h-3 w-3" />}
              {isPartial && <div className="bg-primary-foreground h-2 w-2 rounded-sm" />}
            </div>

            {isExpandable && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(option.id, e);
                }}
                className={cn('cursor-pointer', isDisabled && 'pointer-events-none opacity-50')}
              >
                <ChevronRight className={cn('h-4 w-4 transition-transform', isItemExpanded && 'rotate-90 transform')} />
              </div>
            )}

            <span>{option.label}</span>
          </CommandItem>

          {isExpandable && isItemExpanded && option.children?.map((child) => renderOption(child, depth + 1))}
        </div>
      );
    };

    const filterOptions = (options: HierarchicalOption[], query: string): HierarchicalOption[] => {
      if (!query) return options;

      return options.reduce<HierarchicalOption[]>((filtered, option) => {
        const matchesQuery = option.label.toLowerCase().includes(query.toLowerCase());
        const filteredChildren = option.children ? filterOptions(option.children, query) : [];

        if (matchesQuery || filteredChildren.length > 0) {
          filtered.push({
            ...option,
            children: filteredChildren.length > 0 ? filteredChildren : option.children,
          });
        }
        return filtered;
      }, []);
    };

    const filteredOptions = filterOptions(options, searchQuery);

    return (
      <Popover
        open={open}
        onOpenChange={(state) => {
          setOpen(state);
          if (!state) setSearchQuery('');
        }}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            disabled={disabled}
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              !selectedValues.length && 'text-muted-foreground',
              className,
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <span className="truncate">{getButtonText()}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} onValueChange={setSearchQuery} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>{filteredOptions.map((option) => renderOption(option))}</CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

HierarchicalSelect.displayName = 'HierarchicalSelect';
