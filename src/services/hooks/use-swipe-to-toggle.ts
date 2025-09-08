import { useEffect, useRef } from 'react';

/**
 * Hook que adiciona suporte a gestos de swipe horizontal para abrir ou fechar um componente (ex.: sidebar).
 *
 * O gesto só é considerado válido se iniciado a partir da borda da tela
 * (`edgeSize`), permitindo diferenciar entre swipes de navegação e swipes
 * normais dentro do conteúdo.
 *
 * @param {Object} params - Configurações do hook.
 * @param {() => void} params.onOpen - Função chamada quando um swipe válido indica abertura.
 * @param {() => void} params.onClose - Função chamada quando um swipe válido indica fechamento.
 * @param {number} [params.threshold=50] - Distância mínima em pixels para o swipe ser considerado válido.
 * @param {boolean} [params.enabled=true] - Se `false`, os listeners de toque não são registrados.
 * @param {number} [params.edgeSize=100] - Largura da "zona da borda" em pixels onde o swipe pode ser iniciado.
 * @param {'left' | 'right'} [params.side='left'] - Lado da tela onde a sidebar está localizada.
 *
 * @example
 * // Exemplo de uso para uma sidebar no lado esquerdo
 * useSwipeToToggle({
 *   enabled: isMobile,
 *   side: 'left',
 *   onOpen: () => setSidebarOpen(true),
 *   onClose: () => setSidebarOpen(false),
 * });
 */
export function useSwipeToToggle({
  onOpen,
  onClose,
  threshold = 50,
  enabled = true,
  edgeSize = 100,
  side = 'left',
}: {
  onOpen: () => void;
  onClose: () => void;
  threshold?: number;
  enabled?: boolean;
  edgeSize?: number;
  side?: 'left' | 'right';
}) {
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isEdgeSwipe = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;

    function handleTouchStart(e: TouchEvent) {
      const x = e.touches[0].clientX;
      touchStartX.current = x;
      touchEndX.current = x;

      if (side === 'left') {
        isEdgeSwipe.current = x <= edgeSize;
      } else {
        isEdgeSwipe.current = x >= window.innerWidth - edgeSize;
      }
    }

    function handleTouchMove(e: TouchEvent) {
      touchEndX.current = e.touches[0].clientX;
    }

    function handleTouchEnd() {
      if (touchStartX.current === null || touchEndX.current === null || !isEdgeSwipe.current) {
        touchStartX.current = null;
        touchEndX.current = null;
        isEdgeSwipe.current = false;
        return;
      }

      const diff = touchEndX.current - touchStartX.current;

      if (side === 'left') {
        if (diff > threshold) onOpen();
        if (diff < -threshold) onClose();
      } else {
        if (diff < -threshold) onOpen(); // swipe para esquerda abre no lado direito
        if (diff > threshold) onClose();
      }

      touchStartX.current = null;
      touchEndX.current = null;
      isEdgeSwipe.current = false;
    }

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onOpen, onClose, threshold, enabled, edgeSize, side]);
}
