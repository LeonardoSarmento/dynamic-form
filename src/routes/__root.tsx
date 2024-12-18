import { ErrorComponent } from '@components/ErrorComponent';
import { NotFoundComponent } from '@components/NotFoundComponent';
import { Outlet, ScrollRestoration, createRootRouteWithContext } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { DevTools } from '@components/DevTools';
import { SidebarComponent } from '@components/sidebar';

export const Route = createRootRouteWithContext<{}>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <SidebarComponent>
      <div>
        <ScrollRestoration getKey={(location) => location.pathname} />
        <Outlet />
      </div>
      <Toaster richColors closeButton />
      <DevTools />
    </SidebarComponent>
  );
}
