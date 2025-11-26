import { useEffect, useRef } from 'react';

interface UseAutoRevalidateOptions {
  enabled?: boolean;
  interval?: number; // milliseconds
  onRevalidate?: () => void;
}

/**
 * Hook para revalidação automática de dados em intervalos regulares
 * Similar ao ISR do Next.js, mas no client-side
 * 
 * @param options - Configurações de revalidação
 * @example
 * useAutoRevalidate({
 *   enabled: true,
 *   interval: 60000, // 60 segundos
 *   onRevalidate: () => console.log('Revalidando dados...')
 * });
 */
export const useAutoRevalidate = (options: UseAutoRevalidateOptions = {}) => {
  const {
    enabled = true,
    interval = 60000, // 60 segundos por padrão
    onRevalidate
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastRevalidation = useRef<number>(Date.now());

  useEffect(() => {
    if (!enabled || !onRevalidate) return;

    // Revalidar imediatamente se passou muito tempo desde a última vez
    const timeSinceLastRevalidation = Date.now() - lastRevalidation.current;
    if (timeSinceLastRevalidation > interval) {
      onRevalidate();
      lastRevalidation.current = Date.now();
    }

    // Configurar intervalo de revalidação
    intervalRef.current = setInterval(() => {
      onRevalidate();
      lastRevalidation.current = Date.now();
      console.log('🔄 Auto-revalidação executada');
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, onRevalidate]);

  return {
    lastRevalidation: lastRevalidation.current,
    forceRevalidate: () => {
      if (onRevalidate) {
        onRevalidate();
        lastRevalidation.current = Date.now();
      }
    }
  };
};

/**
 * Hook para detectar mudanças de foco na janela e revalidar
 * Útil para quando o usuário volta para a aba do navegador
 */
export const useRevalidateOnFocus = (onRevalidate: () => void) => {
  useEffect(() => {
    const handleFocus = () => {
      console.log('👁️ Janela focada - revalidando dados');
      onRevalidate();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        handleFocus();
      }
    });

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [onRevalidate]);
};

/**
 * Hook para revalidar quando a conexão de internet é restaurada
 */
export const useRevalidateOnOnline = (onRevalidate: () => void) => {
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Conexão restaurada - revalidando dados');
      onRevalidate();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [onRevalidate]);
};
