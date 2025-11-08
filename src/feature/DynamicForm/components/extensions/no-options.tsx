import { CircleAlert } from 'lucide-react';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty';

export function NoOptions({ description, title }: { description?: string; title?: string }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlert />
        </EmptyMedia>
        <EmptyTitle>{title ?? 'Nenhuma opção encontrada'}</EmptyTitle>
        <EmptyDescription>{description ?? 'Não foi possível encontrar nenhuma opção de escolha.'}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
