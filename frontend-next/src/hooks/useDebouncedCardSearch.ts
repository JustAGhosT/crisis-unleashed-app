import { useCardSearch } from './useCardSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { CardFilters } from '@/types/card';

export function useDebouncedCardSearch(
  filters: CardFilters,
  page = 1,
  pageSize = 20,
  debounceMs = 300
) {
  const debouncedFilters = useDebounce(filters, debounceMs);
  return useCardSearch(debouncedFilters, page, pageSize);
}
