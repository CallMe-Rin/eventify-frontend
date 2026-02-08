import { useQuery } from '@tanstack/react-query';
import { fetchCategories, categoryKeys } from '@/api/categories';

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10, // cache 10 min
  });
}
