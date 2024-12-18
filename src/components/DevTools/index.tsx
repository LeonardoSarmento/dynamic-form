import { TanStackRouterDevtools } from '@components/DevTools/TanStackRouterDevtools';
import { Suspense } from 'react';

export function DevTools() {
  return (
    <Suspense>
      <TanStackRouterDevtools position="bottom-left" />
    </Suspense>
  );
}
