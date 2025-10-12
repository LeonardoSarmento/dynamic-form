import { createFileRoute } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Header from '@components/header';
import { showErrorsAsToasts } from '@lib/error-messages';

import DynamicForm from '@/feature/DynamicForm/DynamicForm';
import { Form } from '@/feature/DynamicForm/components/ui/form';
import { Button } from '@/feature/DynamicForm/components/ui/button';
import { DynamicSchemaTestingComponent, DynamicSchemaTestingComponentType } from '@/feature/DynamicForm/SchemaFormTest';
import { CardHoverItemType, HoverEffect } from '@components/ui/extensions/card-hover';
import React from 'react';
import { Muted } from '@components/typography/muted';
import { Icons } from '@components/icons/icon';
import PWABadge from '@components/pwa/PWABadge';

export const Route = createFileRoute('/')({
  component: ComponentsComponent,
  loader: () => ({
    crumb: 'DynamicForm: Componente para formulários',
  }),
});

type FormCardContent = CardHoverItemType & {
  content: React.ReactNode;
};

function createCards(control: Control<DynamicSchemaTestingComponentType>): FormCardContent[] {
  return [
    {
      title: 'Input Simples',
      content: <DynamicForm control={control} name="input" label="Input Simples" placeholder="Texto" type="input" />,
      description: 'Um campo de texto básico para inserir qualquer informação alfanumérica.',
    },
    {
      title: 'Input para E-mail',
      content: (
        <DynamicForm
          control={control}
          name="email"
          label="Input para E-mail"
          placeholder="email@mail.com"
          type="link"
          description="Insira um endereço de e-mail válido"
        />
      ),
      description: 'Campo específico para inserir endereços de e-mail, validando o formato automaticamente.',
    },
    {
      title: 'Input para Links',
      content: (
        <DynamicForm
          control={control}
          name="link"
          label="Input para Links"
          placeholder="https://example.com"
          type="link"
        />
      ),
      description: 'Campo para inserir URLs ou links, garantindo o formato correto.',
    },
    {
      title: 'Input com Máscara CNPJ',
      content: (
        <DynamicForm control={control} name="cnpj" label="Input CNPJ" placeholder="CNPJ" type="input" mask="cnpj" />
      ),
      description: 'Campo formatado para inserir CNPJs válidos, com máscara automática.',
    },
    {
      title: 'Input com Máscara CPF',
      content: <DynamicForm control={control} name="cpf" label="Input CPF" placeholder="CPF" type="input" mask="cpf" />,
      description: 'Campo formatado para inserir CPFs válidos, com máscara automática.',
    },
    {
      title: 'Input com Máscara Telefone',
      content: (
        <DynamicForm control={control} name="phone" label="Telefone" placeholder="Telefone" type="input" mask="phone" />
      ),
      description: 'Campo para números de telefone com formatação automática.',
    },
    {
      title: 'Input com Máscara MAC Address',
      content: (
        <DynamicForm
          control={control}
          name="macAddress"
          label="MAC Address"
          placeholder="Mac Address"
          type="input"
          mask="macAddress"
        />
      ),
      description: 'Campo para inserir endereços MAC de dispositivos, com máscara apropriada.',
    },
    {
      title: 'Input com Máscara IP',
      content: <DynamicForm control={control} name="ip" label="Endereço IP" placeholder="IP" type="input" mask="ip" />,
      description: 'Campo para inserir endereços IP, validando o formato automaticamente.',
    },
    {
      title: 'Input Numérico',
      content: (
        <DynamicForm
          control={control}
          label="Número"
          name="number"
          type="number"
          placeholder="Coloque um valor"
          hint="R$"
        />
      ),
      description: 'Campo para valores numéricos, podendo incluir símbolos monetários ou unidades.',
    },
    {
      title: 'Input Password',
      content: <DynamicForm control={control} name="password" label="Senha" placeholder="Senha" type="password" />,
      description: 'Campo para senhas, ocultando os caracteres digitados.',
    },
    {
      title: 'Checkbox',
      content: (
        <DynamicForm
          control={control}
          name="checkbox"
          type="checkbox"
          label="Escolha opções"
          checkboxoptions={[
            { id: 'opcao1', label: 'Opção 1' },
            { id: 'opcao2', label: 'Opção 2', disabled: true },
            { id: 'opcao3', label: 'Opção 3' },
          ]}
        />
      ),
      description: 'Permite selecionar uma ou mais opções de forma independente.',
    },
    {
      title: 'Hierarchical',
      content: (
        <DynamicForm
          control={control}
          name="hierarchical"
          type="hierarchical"
          label="Seleção Hierárquica"
          placeholder="Selecione uma opção"
          maxSelected={3}
          options={[
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
          ]}
        />
      ),
      description: 'Seleção de opções organizadas hierarquicamente, permitindo escolher múltiplos níveis.',
    },
    {
      title: 'Combobox',
      content: (
        <DynamicForm
          control={control}
          name="combobox"
          type="combobox"
          label="Combobox"
          comboboxoptions={[
            { id: 'opcao1', label: 'Opção 1' },
            { id: 'opcao2', label: 'Opção 2' },
            { id: 'opcao3', label: 'Opção 3', disabled: true },
          ]}
        />
      ),
      description: 'Campo de seleção que combina entrada manual e lista suspensa de opções.',
    },
    {
      title: 'Radio',
      content: (
        <DynamicForm
          control={control}
          name="radio"
          type="radio"
          label="Escolha uma opção"
          radiooptions={[
            { id: 'all', label: 'Opção 1', disabled: true },
            { id: 'mentions', label: 'Opção 2' },
            { id: 'none', label: 'Opção 3' },
          ]}
        />
      ),
      description: 'Permite selecionar apenas uma opção dentro de um conjunto.',
    },
    {
      title: 'Switch',
      content: <DynamicForm control={control} name="switch" type="switch" label="Switch" />,
      description: 'Componente de alternância binária, útil para ligar/desligar opções.',
    },
    {
      title: 'Select',
      content: (
        <DynamicForm
          control={control}
          label="Select"
          name="select"
          type="select"
          selectoptions={[
            { id: 'opcao1', label: 'Opção 1' },
            { id: 'opcao2', label: 'Opção 2' },
            { id: 'opcao3', label: 'Opção 3', disabled: true },
          ]}
        />
      ),
      description: 'Campo de seleção com lista de opções, permitindo escolher apenas uma.',
    },
    {
      title: 'Multi Select',
      content: (
        <DynamicForm
          control={control}
          name="multiSelect"
          type="multi-select"
          label="Multi Select"
          multiselectoptions={[
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
          ]}
        />
      ),
      description: 'Permite selecionar múltiplas opções de uma lista, com possibilidade de opções desabilitadas.',
    },
    {
      title: 'Textarea',
      content: (
        <DynamicForm
          control={control}
          label="Textarea"
          name="textarea"
          type="textarea"
          placeholder="Escreva seu conteúdo aqui"
        />
      ),
      description: 'Área de texto para inserção de conteúdo maior ou parágrafos completos.',
    },
    {
      title: 'Range Date',
      content: <DynamicForm control={control} label="Range Date" name="rangeDate" type="date" mode="range" />,
      description: 'Permite selecionar um intervalo de datas.',
    },
    {
      title: 'Data',
      content: (
        <DynamicForm control={control} label="Data" name="date" type="date" mode="single" customLocale="en-US" />
      ),
      description: 'Seleciona uma data única usando um calendário interativo.',
    },
    {
      title: 'Data e hora inteligente',
      content: <DynamicForm control={control} label="Data e hora" name="datetime" type="datetime-input" />,
      description: 'Seleciona uma data única usando um calendário interativo ou escreva no input.',
    },
    {
      title: 'Upload de Arquivos',
      content: (
        <DynamicForm
          control={control}
          dropzone={{ multiple: true, maxFiles: 7 }}
          reSelect={false}
          name="fileUpload"
          type="file-upload"
        />
      ),
      description: 'Permite selecionar e enviar arquivos para o sistema.',
    },
  ];
}

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
      hierarchical: [],
    },
  });

  const onSubmit = form.handleSubmit(
    () => {
      toast.success('Testado com sucesso', {
        description: 'Todos componentes estão prontos para uso!',
      });
    },
    (error) => {
      showErrorsAsToasts(error);
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
      datetime: undefined,
      rangeDate: undefined,
      combobox: undefined,
      radio: undefined,
      number: undefined,
      switch: false,
      select: undefined,
      checkbox: [],
      hierarchical: [],
      multiSelect: [],
      fileUpload: [],
    });
  }

  const FormCardContent = React.useMemo(() => createCards(form.control), [form.control]);

  return (
    <>
      <Header
        title="Componentes"
        description="Lista de componentes criados de forma dinâmica utilizando apenas o DynamicForm, possuindo tipagem e validação."
      />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <HoverEffect items={FormCardContent} />
          <div className="flex justify-center gap-x-3">
            <Button type="submit">Enviar</Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Limpar
            </Button>
          </div>
        </form>
      </Form>
      <Muted className="mx-auto flex cursor-[url('/thumbs-up.svg')_0_0,_pointer] flex-wrap items-center justify-center gap-2 text-center">
        <span>©︎ 2025. Feito com muito carinho por Leonardo Araujo Sarmento</span>
        <Icons.logo />
      </Muted>
      <PWABadge />
    </>
  );
}
