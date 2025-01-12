# Template for front-end applications

All around template for front-end applications

Visit the site at [template](https://template.leosarmento.com)

## Portfolio Technologies

### **Features**

- Sidebar menu
- DataTable
- Calendar
- URL Search Params
- Async State Management
- Typed Router
- Form validation
- Charts

### **Main Technologies**

- **Language** : `TypeScript` (~5.6.2)
- **Web Application framework** : `Vite` (^5.4.9)
- **Router**: `@tanstack/router-plugin` (^1.79.0)
- State Managment : `@tanstack/query` (^5.59.16)
- Charts : `recharts` (^2.13.0)
- Form : `react-hook-form` (^7.53.1)
- Validation : `zod` (^3.23.8)
- Styling : `tailwindcss` (^3.4.14)
- Lint : `eslint` (^9.13.0)
- Formatting : `prettier` (^3.3.3)

---

# DynamicForm

A Form component with multiple input field types, validations, and type-safe features.

Visit the demo at [@leosarmento/DynamicForm](https://form.leosarmento.com)  
GitHub Repository: [@LeonardoSarmento/dynamic-form](https://github.com/LeonardoSarmento/dynamic-form)  
Connect on LinkedIn: [@leosarmento/LinkedIn](https://linkedin.com/in/leonardo-araujo-sarmento)  
Explore Portfolio: [@leosarmento/portfolio](https://leosarmento.com)

---

## DynamicForm Technologies

### **Main Technologies**

- **Language**: `TypeScript` (~5.6.2)
- **Form Handling**: `react-hook-form` (^7.53.2)
- **Validation**: `zod` (^3.23.8)
- **Styling**: `tailwindcss` (^3.4.15)

### **Auxiliary Technologies**

- **File Drop**: `react-dropzone` (^14.2.10)
- **Calendar**: `react-day-picker` (^9.4.4) & `date-fns` (^3.6.0)

---

## Features

- **Validation**: Built-in validation for all field types.
- **Type-safe**: Fully type-safe for seamless development.
- **Ease of Use**: Designed for simplicity and flexibility.

---

## How to Access the DynamicForm Code

To get the **DynamicForm** component and use it in your project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/LeonardoSarmento/dynamic-form.git
   ```

2. Navigate to the `src` folder:

   ```bash
   cd dynamic-form/src
   ```

3. Locate the **DynamicForm** code:

   Inside the `src` folder, you will find a subfolder named `feature`. Within it, there's a folder called `DynamicForm` containing all the necessary code:

   ```
   src/
   ├── feature/
   │   ├── DynamicForm/
   │   │   ├── components/      # Sub-components
   │   │   ├── lib/             # Utility libraries
   │   │   ├── types/           # Type definitions
   │   │   ├── DynamicForm.tsx  # Main DynamicForm component
   │   │   └── README.md        # Documentation
   ```

4. Copy or import the `DynamicForm` folder into your project.

---

## Usage

Once the **DynamicForm** folder is in your project, you can import and use the `DynamicForm` component:

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Header from '@components/header';
import DynamicForm from '@/feature/DynamicForm/DynamicForm';
import {
  DynamicSchemaTestingComponent,
  DynamicSchemaTestingComponentType,
} from '@/feature/DynamicForm/types/DynamicFormType';

import { Form } from '@/feature/DynamicForm/components/ui/form';
import { Button } from '@/feature/DynamicForm/components/ui/button';

function DynamicFormComponent() {
  const form = useForm<DynamicSchemaTestingComponentType>({
    resolver: zodResolver(DynamicSchemaTestingComponent),
    mode: 'onChange',
    defaultValues: {
      checkbox: [],
      input: '',
      cnpj: '',
      password: '',
      multiSelect: [],
      textarea: '',
    },
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success('Testado com sucesso', {
      description: 'Todos componentes estão prontos para uso!',
    });
  });

  function handleReset() {
    form.reset({
      input: '',
      password: '',
      phone: '',
      cnpj: '',
      cpf: '',
      ip: '',
      link: '',
      email: '',
      textarea: '',
      macAddress: '',
      date: undefined,
      rangeDate: undefined,
      checkbox: [],
      multiSelect: [],
    });
  }
  return (
    <>
      <Header
        title="Componentes"
        description="Lista de componentes criados de forma dinâmica utilizando apenas o DynamicForm, possuindo tipagem e validação."
      />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-4">
              <DynamicForm
                control={form.control}
                name="input"
                label="Componente Input"
                placeholder="Text"
                type="input"
              />
              <DynamicForm
                control={form.control}
                name="email"
                label="Componente Input para E-mail"
                placeholder="E-mail"
                type="input"
              />
              <DynamicForm
                control={form.control}
                name="link"
                label="Componente Input para Link"
                placeholder="Link"
                type="input"
                description="https://example.com"
              />
              <DynamicForm
                control={form.control}
                name="cnpj"
                label="Componente Input com máscara para CNPJ"
                placeholder="CNPJ"
                type="input"
                mask="cnpj"
              />
              <DynamicForm
                control={form.control}
                name="cpf"
                label="Componente Input com máscara para CPF"
                placeholder="CPF"
                type="input"
                mask="cpf"
              />
              <DynamicForm
                control={form.control}
                name="phone"
                label="Componente Input com máscara para Telefone"
                placeholder="Telefone"
                type="input"
                mask="phone"
              />
              <DynamicForm
                control={form.control}
                name="macAddress"
                label="Componente Input com máscara para MacAddress"
                placeholder="Mac Address"
                type="input"
                mask="macAddress"
              />
              <DynamicForm
                control={form.control}
                name="ip"
                label="Componente Input com máscara para IP"
                placeholder="IP"
                type="input"
                mask="ip"
              />
              <DynamicForm
                control={form.control}
                label="Componente Número"
                name="number"
                type="number"
                placeholder="Coloque um valor"
                hint="R$"
              />
              <DynamicForm
                control={form.control}
                name="password"
                label="Componente Password"
                placeholder="Senha"
                type="password"
              />
              <DynamicForm
                control={form.control}
                name="checkbox"
                type="checkbox"
                label="Componente checkbox"
                checkboxoptions={[
                  { id: 'opcao1', label: 'Opção 1' },
                  { id: 'opcao2', label: 'Opção 2', disabled: true },
                  { id: 'opcao3', label: 'Opção 3' },
                ]}
              />
              <DynamicForm
                control={form.control}
                name="combobox"
                type="combobox"
                label="Componente Combobox"
                comboboxoptions={[
                  { id: 'opcao1', label: 'Opção 1' },
                  { id: 'opcao2', label: 'Opção 2' },
                  { id: 'opcao3', label: 'Opção 3', disabled: true },
                ]}
              />
              <DynamicForm
                control={form.control}
                name="radio"
                type="radio"
                label="Componente Radio"
                radiooptions={[
                  { id: 'all', label: 'Opção 1', disabled: true },
                  { id: 'mentions', label: 'Opção 2' },
                  { id: 'none', label: 'Opção 3' },
                ]}
              />
              <DynamicForm control={form.control} name="switch" type="switch" label="Componente switch" />
              <DynamicForm
                control={form.control}
                label="Componente Select"
                name="select"
                type="select"
                selectoptions={[
                  { id: 'opcao1', label: 'Opção 1' },
                  { id: 'opcao2', label: 'Opção 2' },
                  { id: 'opcao3', label: 'Opção 3', disabled: true },
                ]}
              />
              <DynamicForm
                control={form.control}
                name="multiSelect"
                type="multi-select"
                label="Componente Multi Select"
                multiselectoptions={[
                  { id: 'opcao1', label: 'Opção 1' },
                  { id: 'opcao2', label: 'Opção 2', disabled: true },
                  { id: 'opcao3', label: 'Opção 3' },
                ]}
              />
              <DynamicForm
                control={form.control}
                label="Componente Textarea"
                name="textarea"
                type="textarea"
                placeholder="Escreva sobre seu conteúdo"
              />
              <DynamicForm
                control={form.control}
                label="Componente Range Data"
                name="rangeDate"
                type="date"
                mode="range"
              />
              <DynamicForm
                control={form.control}
                label="Componente Data"
                name="date"
                type="date"
                mode="single"
                customLocale="en-US"
              />
              <DynamicForm control={form.control} name="fileUpload" type="file-upload" />
            </div>
            <div className="flex justify-center gap-x-3">
              <Button type="submit">Enviar</Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Limpar
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
```

---

## Input Field Types and Options

### **Input**

Supports custom masks through props. Pre-implemented options include:

1. CPF
2. CNPJ
3. Phone
4. MAC Address
5. IP Address

You can also pass your custom mask.

### **Number**

### **Password**

### **Text Area**

### **Date**

Choose your preferred calendar mode:

1. Single
2. Range

### **Select**

### **Multiple Select**

### **Switch**

### **Checkbox**

### **Radio**

### **File Input**

### **Combobox**

---

## How to Use

To learn how to integrate DynamicForm into your project, check out the documentation at [@leosarmento/dynamic-form](https://github.com/leosarmento/dynamic-form).

---

Happy Coding! 🎉
