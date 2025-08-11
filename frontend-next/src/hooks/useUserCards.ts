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
      } catch (e: any) {
        if (!cancelled && !controller.signal.aborted) {
          setError(e?.message ?? 'Failed to load user cards');
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
