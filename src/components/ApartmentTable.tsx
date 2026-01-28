'use client';

import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TrashIcon } from 'lucide-react';

type Apartment = {
  id: string;
  apartmentName: string;
  bahadurName: string;
  bahadurMobile: string;
  pramukhName: string;
  pramukhMobile: string;
};

async function fetchApartments({ pageParam }: { pageParam?: string }) {
  const params = new URLSearchParams();
  params.set('export', 'apartment');
  params.set('limit', '20');
  if (pageParam) params.set('cursor', pageParam);

  const res = await fetch(`/api/admin/apartment?${params.toString()}`);
  if (!res.ok) {
    toast.error('Failed to load apartments');
    throw new Error();
  }
  return res.json();
}

export default function ApartmentTable({
  setOpenApartmentForm,
  setEditApartment,
}: {
  // eslint-disable-next-line no-unused-vars
  setOpenApartmentForm: (value: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setEditApartment: (value: Apartment | undefined) => void;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ['apartmentspage'],
    queryFn: ({ pageParam }) => fetchApartments({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  async function deleteApartment(id: string, onSuccess: () => void) {
    if (!confirm('Delete this apartment permanently?')) return;

    const t = toast.loading('Deleting apartment...');
    try {
      const res = await fetch(`/api/admin/apartment/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Apartment deleted', { id: t });
      onSuccess();
    } catch {
      toast.error('Delete failed', { id: t });
    }
  }

  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;
    const obs = new IntersectionObserver((e) => e[0].isIntersecting && fetchNextPage());
    obs.observe(loadMoreRef.current);
    return () => obs.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const apartments: Apartment[] = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-appSurface border border-appBorder rounded-lg overflow-hidden">
          <thead className="bg-appBg text-xs text-appMuted">
            <tr>
              <th className="px-4 py-3 text-left">Apartment Name</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">Bahadur Name</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">Bahadur Mo.</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">Pramukh Name</th>
              <th className="px-4 py-3 text-left">Pramukh Mobile</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((v, index) => (
              <tr key={v.id} className="border-t border-appBorder hover:bg-appBg">
                <td className="px-4 py-3 font-medium text-appText">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-appText">
                  {v.apartmentName}
                  <div className="sm:hidden text-xs text-appMuted">
                    {v.pramukhName} • mobile {v.pramukhMobile}
                  </div>
                </td>

                <td className="px-4 py-3 hidden sm:table-cell">{v.bahadurName}</td>
                <td className="px-4 py-3 hidden sm:table-cell">{v.bahadurMobile}</td>
                <td className="px-4 py-3 hidden sm:table-cell">{v.pramukhName}</td>

                <td className="px-4 py-3">{v.pramukhMobile}</td>

                <td className="px-4 py-3 text-right flex justify-end items-center gap-4">
                  <button
                    onClick={() => deleteApartment(v.id, refetch)}
                    className="text-danger hover:text-danger"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setEditApartment(v);
                      setOpenApartmentForm(true);
                    }}
                    className="text-sm text-appPrimary"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasNextPage && <div ref={loadMoreRef} className="h-6" />}
      {isFetchingNextPage && <p className="text-center text-sm text-appMuted">Loading more…</p>}
    </>
  );
}
