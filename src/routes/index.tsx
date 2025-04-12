import { createFileRoute } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Header from '@components/header';
import { showErrorsAsToasts } from '@lib/error-messages';

import DynamicForm from '@/feature/DynamicForm/DynamicForm';
import { Form } from '@/feature/DynamicForm/components/ui/form';
import { Button } from '@/feature/DynamicForm/components/ui/button';
import { DynamicSchemaTestingComponent, DynamicSchemaTestingComponentType } from '@/feature/DynamicForm/SchemaFormTest';

export const Route = createFileRoute('/')({
  component: ComponentsComponent,
  loader: () => ({
    crumb: 'DynamicForm: Componente para formulários',
  }),
});

function ComponentsComponent() {
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

  const onSubmit = form.handleSubmit(
    () => {
      toast.success('Testado com sucesso', {
        description: 'Todos componentes estão prontos para uso!',
      });
    },
    (error) => {
      showErrorsAsToasts(error)
    },
  );

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
                label="Componente Input/Link para E-mail"
                placeholder="E-mail"
                type="link"
                description="email@mail.com"
              />
              <DynamicForm
                control={form.control}
                name="link"
                label="Componente Input/Link para Link"
                placeholder="Link"
                type="link"
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
