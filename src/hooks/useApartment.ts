// hooks/useApartments.ts
import { useQuery } from '@tanstack/react-query';

type ApartmentOption = {
  id: string;
  apartmentName: string;
};

async function fetchApartments(): Promise<ApartmentOption[]> {
  const res = await fetch('/api/admin/apartment?onlyNames=true');
  if (!res.ok) throw new Error('Failed to load apartments');
  const data = await res.json();
  return data.data;
}

export function useApartments() {
  return useQuery({
    queryKey: ['apartments'],
    queryFn: fetchApartments,
    staleTime: 60 * 60 * 1000, // 1 hour cache
  });
}
