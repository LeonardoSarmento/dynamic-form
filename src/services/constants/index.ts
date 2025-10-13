export const CHECKBOX_OPTIONS = [
  { id: 'opcao1', label: 'Opção 1' },
  { id: 'opcao2', label: 'Opção 2', disabled: true },
  { id: 'opcao3', label: 'Opção 3' },
];

export const HIERARCHICAL_OPTIONS = [
  { id: 'opcao1', label: 'Opção 1' },
  {
    id: 'opcao2',
    label: 'Opção 2',
    children: [
      { id: 'opcao2.1', label: 'Opção 2.1' },
      { id: 'opcao2.2', label: 'Opção 2.2' },
      { id: 'opcao2.3', label: 'Opção 2.3', disabled: true },
    ],
  },
  {
    id: 'opcao3',
    label: 'Opção 3',
    children: [
      { id: 'opcao3.1', label: 'Opção 3.1' },
      { id: 'opcao3.2', label: 'Opção 3.2' },
      { id: 'opcao3.3', label: 'Opção 3.3', disabled: true },
      {
        id: 'opcao3.4',
        label: 'Opção 3.4',
        children: [
          { id: 'opcao3.4.1', label: 'Opção 3.4.1', disabled: true },
          { id: 'opcao3.4.2', label: 'Opção 3.4.2' },
          { id: 'opcao3.4.3', label: 'Opção 3.4.3' },
        ],
      },
    ],
  },
  {
    id: 'opcao4',
    label: 'Opção 4',
    disabled: true,
    children: [
      { id: 'opcao4.1', label: 'Opção 4.1' },
      { id: 'opcao4.2', label: 'Opção 4.2' },
      { id: 'opcao4.3', label: 'Opção 4.3', disabled: true },
      { id: 'opcao4.4', label: 'Opção 4.4' },
    ],
  },
];

export const COMBOBOX_OPTIONS = [
  { id: 'opcao1', label: 'Opção 1' },
  { id: 'opcao2', label: 'Opção 2' },
  { id: 'opcao3', label: 'Opção 3', disabled: true },
];

export const RADIO_OPTIONS = [
  { id: 'all', label: 'Opção 1', disabled: true },
  { id: 'mentions', label: 'Opção 2' },
  { id: 'none', label: 'Opção 3' },
];

export const SELECT_OPTIONS = [
  { id: 'opcao1', label: 'Opção 1' },
  { id: 'opcao2', label: 'Opção 2' },
  { id: 'opcao3', label: 'Opção 3', disabled: true },
];

export const MULTISELECT_OPTIONS = [
  { id: 'opcao1', label: 'Opção 1' },
  { id: 'opcao2', label: 'Opção 2', disabled: true },
  { id: 'opcao3', label: 'Opção 3' },
  { id: 'opcao4', label: 'Opção 4' },
  { id: 'opcao5', label: 'Opção 5', disabled: true },
  { id: 'opcao6', label: 'Opção 6' },
  { id: 'opcao7', label: 'Opção 7' },
  { id: 'opcao8', label: 'Opção 8', disabled: true },
  { id: 'opcao9', label: 'Opção 9' },
  { id: 'opcao10', label: 'Opção 10' },
  { id: 'opcao20', label: 'Opção 20', disabled: true },
  { id: 'opcao30', label: 'Opção 30' },
  { id: 'opcao40', label: 'Opção 40' },
  { id: 'opcao50', label: 'Opção 50', disabled: true },
  { id: 'opcao60', label: 'Opção 60' },
  { id: 'opcao70', label: 'Opção 70' },
  { id: 'opcao80', label: 'Opção 80', disabled: true },
  { id: 'opcao90', label: 'Opção 90' },
];
