import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';

function PWABadge() {
  const period = 60 * 60 * 1000;

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === 'activated') {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === 'activated') registerPeriodicSync(period, swUrl, r);
        });
      }
    },
  });

  useEffect(() => {
    if (offlineReady) {
      toast.success('App pronto para funcionar offline 🚀', {
        action: {
          label: 'Fechar',
          onClick: () => setOfflineReady(false),
        },
      });
    }

    if (needRefresh) {
      toast.info('Novo conteúdo disponível ✨', {
        description: 'Clique em "Recarregar" para atualizar',
        action: {
          label: 'Recarregar',
          onClick: () => updateServiceWorker(true),
        },
        cancel: {
          label: 'Fechar',
          onClick: () => setNeedRefresh(false),
        },
      });
    }
  }, [offlineReady, needRefresh, updateServiceWorker]);

  return null;
}

export default PWABadge;

function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
  if (period <= 0) return;

  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        'cache-control': 'no-cache',
      },
    });

    if (resp?.status === 200) await r.update();
  }, period);
}
