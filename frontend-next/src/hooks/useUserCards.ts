import { useEffect, useState } from 'react';
import { CardService } from '@/services/cardService';
import { UserCard } from '@/types/card';

export function useUserCards(userId?: string) {
  const [data, setData] = useState<UserCard[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      if (!userId) {
        setData(undefined);
        return;
      }
      setIsLoading(true);
      setError(undefined);
      try {
        const result = await CardService.getUserCards(userId, controller.signal);
        if (!cancelled) setData(result);
      } catch (e: unknown) {
        if (!cancelled && !controller.signal.aborted) {
          let message = 'Failed to load user cards';
          if (e && typeof e === 'object') {
            const maybeResponse = (e as { response?: { data?: unknown } }).response;
            const data = maybeResponse?.data;
            if (typeof data === 'string') message = data;
            else if (
              data &&
              typeof data === 'object' &&
              'message' in (data as Record<string, unknown>) &&
              typeof (data as Record<string, unknown>).message === 'string'
            ) {
              message = (data as Record<string, unknown>).message as string;
            } else if (e instanceof Error) {
              message = e.message;
            }
          } else if (e instanceof Error) {
            message = e.message;
          }
          setError(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [userId]);

  return { data, isLoading, error };
}
