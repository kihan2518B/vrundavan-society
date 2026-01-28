'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ExportDropdown from '@/components/ExportDropdown';
import { VehicleFilters } from '@/types';
import { useApartments } from '@/hooks/useApartment';

/* ----------------------------- Types ----------------------------- */
type Vehicle = {
  id: string;
  vehicleNumber: string;
  ownerName: string;
  blockNumber: string;
  floor: string;
  contactNumber: string;
};
function buildVehicleQuery(filters: VehicleFilters, cursor?: string) {
  const params = new URLSearchParams();
  params.set('export', 'vehicle');

  if (filters.apartmentId) params.set('apartmentId', filters.apartmentId);
  if (filters.block) params.set('block', filters.block);
  if (filters.floor) params.set('floor', filters.floor);
  if (filters.search) params.set('search', filters.search);
  if (cursor) params.set('cursor', cursor);

  params.set('limit', '20');
  return params.toString();
}

async function fetchVehicles({
  pageParam,
  filters,
}: {
  pageParam?: string;
  filters: VehicleFilters;
}) {
  const res = await fetch(`/api/admin/vehicle?${buildVehicleQuery(filters, pageParam)}`);
  if (!res.ok) {
    toast.error('Failed to load vehicles');
    throw new Error('Fetch failed');
  }
  return res.json();
}
/* ----------------------------- Page ----------------------------- */
export default function ReportPage() {
  const [filters, setFilters] = useState<VehicleFilters>({
    apartmentId: null,
    block: null,
    floor: null,
    search: null,
  });

  const { data: apartments } = useApartments();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['vehicles', filters],
    queryFn: ({ pageParam }) => fetchVehicles({ pageParam, filters }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;
    const observer = new IntersectionObserver((e) => e[0].isIntersecting && fetchNextPage());
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const vehicles: Vehicle[] = data?.pages.flatMap((p) => p.data) ?? [];

  /* ----------------------------- UI ----------------------------- */
  return (
    <main className="min-h-fit bg-appBg flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-appSurface border-b border-appBorder">
        <div className="max-w-5xl mx-auto px-4 py-3 space-y-3">
          {/* Top Row */}
          <div className="flex items-center gap-2">
            <Link href="/" className="w-9 h-9 rounded-lg bg-appBg flex items-center justify-center">
              ←
            </Link>

            <h1 className="flex-1 font-semibold text-appText">Vehicles Reports</h1>
            <ExportDropdown filters={filters} view={'vehicle'} />
          </div>

          {/* VEHICLE FILTERS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <input
              placeholder="Search"
              className="px-3 py-2 rounded-lg border border-appBorder text-sm"
              value={filters.search ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || null }))}
            />

            <select
              value={filters.apartmentId ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, apartmentId: e.target.value || null }))}
              className="px-3 py-2 rounded-lg border border-appBorder text-sm"
            >
              <option value="">All Apartments</option>
              {apartments?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.apartmentName}
                </option>
              ))}
            </select>

            <input
              placeholder="Block"
              className="px-3 py-2 rounded-lg border border-appBorder text-sm"
              value={filters.block ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, block: e.target.value || null }))}
            />

            <input
              placeholder="Floor"
              className="px-3 py-2 rounded-lg border border-appBorder text-sm"
              value={filters.floor ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, floor: e.target.value || null }))}
            />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="flex-1 max-w-5xl mx-auto w-full px-4 py-4">
        <>
          {vehicles.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-appSurface border border-appBorder rounded-lg overflow-hidden">
                <thead className="bg-appBg text-xs text-appMuted">
                  <tr>
                    <th className="px-4 py-3 text-left">Vehicle</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">Owner</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">Block</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">Floor</th>
                    <th className="px-4 py-3 text-left">Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id} className="border-t border-appBorder hover:bg-appBg">
                      <td className="px-4 py-3 font-medium text-appText">
                        {v.vehicleNumber}
                        <div className="sm:hidden text-xs text-appMuted">
                          {v.ownerName} • Block {v.blockNumber} • Floor {v.floor}
                        </div>
                      </td>

                      <td className="px-4 py-3 hidden sm:table-cell">{v.ownerName}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">{v.blockNumber}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">{v.floor}</td>

                      <td className="px-4 py-3">{v.contactNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      </section>
    </main>
  );
}
