import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Suspense } from 'react';

export function DevTools() {
  return (
    <Suspense>
      <TanStackRouterDevtools initialIsOpen={false} position="bottom-left" />
    </Suspense>
  );
}
