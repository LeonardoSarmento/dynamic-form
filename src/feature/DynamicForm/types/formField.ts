import { z } from 'zod';

import { Command as CommandPrimitive } from 'cmdk';

import { RadioGroupProps } from '@radix-ui/react-radio-group';
import { SelectTriggerProps } from '@radix-ui/react-select';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { CheckboxProps } from '@radix-ui/react-checkbox';

import { DropzoneOptions } from 'react-dropzone';

import { baseInputSchema } from './schemas/fields';

import { AutosizeTextAreaProps } from '../components/ui/autosize-textarea';
import { CalendarProps } from '../components/ui/calendar';
import { ButtonProps } from '../components/ui/button';
import { InputProps } from '../components/ui/input';
import { HierarchicalCheckboxProps } from '../components/extensions/hierarchical-checkbox';

export type BaseInputT = z.infer<typeof baseInputSchema>;

type PasswordT = {
  type: 'password';
} & InputProps;

type NumberT = {
  type: 'number';
} & InputProps;

type TextAreaT = {
  type: 'textarea';
} & AutosizeTextAreaProps;

type DateT = {
  type: 'date';
} & CalendarProps;

type HierarchicalT = {
  type: 'hierarchical';
} & HierarchicalCheckboxProps;

type SelectT = {
  type: 'select';
} & Omit<SelectTriggerProps, 'type'> &
  React.RefAttributes<HTMLButtonElement>;

type MultiSelectT = Omit<React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>, 'type'> & {
  type: 'multi-select';
};

type SwitchT = Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>, 'type'> & {
  type: 'switch';
};

type CheckboxT = {
  type: 'checkbox';
} & Omit<CheckboxProps, 'type'> &
  React.RefAttributes<HTMLButtonElement>;

type RadioT = {
  type: 'radio';
} & RadioGroupProps &
  React.RefAttributes<HTMLDivElement>;

type ComboboxItemT = {
  type: 'combobox';
  handlecustomselect?: (value: string) => void;
  classNameCommandItem?: string;
} & Omit<ButtonProps, 'type'> &
  React.RefAttributes<HTMLButtonElement>;

type FileUploadT = {
  type: 'file-upload';
  dropzone?: DropzoneOptions;
} & React.HTMLAttributes<HTMLDivElement> & {
    disabled?: boolean;
  } & React.RefAttributes<HTMLDivElement>;

type LinkT = {
  type: 'link';
} & InputProps;

type InputT = {
  type: 'input';
} & InputProps;

export type ExtendedFormProps =
  | PasswordT
  | NumberT
  | TextAreaT
  | DateT
  | SelectT
  | SwitchT
  | MultiSelectT
  | CheckboxT
  | HierarchicalT
  | RadioT
  | ComboboxItemT
  | FileUploadT
  | LinkT
  | InputT;
