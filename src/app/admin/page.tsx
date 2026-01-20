'use client';

import VehicleFormSheet from '@/components/VehicleForm';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

async function fetchVehicles({ pageParam }: { pageParam?: string }) {
  const res = await fetch(`/api/admin/vehicle?limit=20${pageParam ? `&cursor=${pageParam}` : ''}`);
  return res.json();
}
type Vehicle = {
  id: string;
  vehicleNumber: string;
  ownerName: string;
  flatNumber: string;
  contactNumber: string;
  createdAt: string;
};

export default function AdminPage() {
  const [openForm, setOpenForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | undefined>(undefined);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch } =
    useInfiniteQuery({
      queryKey: ['vehicles'],
      queryFn: fetchVehicles,
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 5 * 60 * 1000,
    });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const vehicles = data?.pages.flatMap((p) => p.data) ?? [];
  const totalCount = vehicles.length;

  return (
    <main className="min-h-screen bg-appBg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-appSurface border-b border-appBorder shadow-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Top Row - Back Button & Title */}
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-appBg hover:bg-appBorder transition-colors"
              aria-label="Back to home"
            >
              <svg
                className="w-5 h-5 text-appText"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-appText">Vehicle Management</h1>
              <p className="text-xs text-appMuted">
                {status === 'success' &&
                  `${totalCount} vehicle${totalCount !== 1 ? 's' : ''} registered`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setEditVehicle(undefined);
                setOpenForm(true);
              }}
              className="
                flex items-center gap-2 px-4 py-2.5 rounded-lg
                bg-appPrimary text-white font-medium text-sm
                hover:bg-appPrimaryHover active:scale-98
                shadow-button transition-all
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Vehicle
            </button>

            <a
              href="/api/admin/export/excel"
              className="
                flex items-center gap-2 px-4 py-2.5 rounded-lg
                bg-appSurface border border-appBorder text-appText
                font-medium text-sm hover:bg-appBg
                transition-colors
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Excel
            </a>

            <a
              href="/api/admin/export/pdf"
              className="
                flex items-center gap-2 px-4 py-2.5 rounded-lg
                bg-appSurface border border-appBorder text-appText
                font-medium text-sm hover:bg-appBg
                transition-colors
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              PDF
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-4">
        {/* Loading State */}
        {status === 'pending' && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-appSurface rounded-lg p-4 border border-appBorder animate-pulse"
              >
                <div className="h-5 bg-appBg rounded w-32 mb-3"></div>
                <div className="h-4 bg-appBg rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {status === 'success' && vehicles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-appBg flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-appMuted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-appText mb-1">No Vehicles Yet</h3>
            <p className="text-sm text-appMuted text-center mb-6">
              Start by adding the first vehicle to your database
            </p>
            <button
              onClick={() => {
                setEditVehicle(undefined);
                setOpenForm(true);
              }}
              className="
                flex items-center gap-2 px-5 py-2.5 rounded-lg
                bg-appPrimary text-white font-medium text-sm
                hover:bg-appPrimaryHover
                shadow-button transition-all
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add First Vehicle
            </button>
          </div>
        )}

        {/* Vehicle List */}
        {status === 'success' && vehicles.length > 0 && (
          <div className="space-y-3">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="
                  bg-appSurface rounded-lg p-4 border border-appBorder
                  hover:shadow-cardHover transition-shadow
                "
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Vehicle Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-appPrimaryLight flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-appPrimary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <p className="font-semibold text-appText text-base">{v.vehicleNumber}</p>
                    </div>

                    <div className="space-y-1.5 ml-10">
                      <div className="flex items-center gap-2 text-sm">
                        <svg
                          className="w-4 h-4 text-appMuted flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-appText font-medium truncate">{v.ownerName}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <svg
                          className="w-4 h-4 text-appMuted flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        <span className="text-appMuted truncate">{v.flatNumber}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <svg
                          className="w-4 h-4 text-appMuted flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-appMuted truncate">{v.contactNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setEditVehicle(v);
                      setOpenForm(true);
                    }}
                    className="
                      flex items-center gap-1.5 px-3 py-2 rounded-lg
                      bg-appPrimaryLight text-appPrimary
                      hover:bg-appPrimary hover:text-white
                      font-medium text-sm transition-all
                      flex-shrink-0
                    "
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Infinite Scroll Trigger */}
            {hasNextPage && <div ref={loadMoreRef} className="h-10" />}

            {/* Loading More Indicator */}
            {isFetchingNextPage && (
              <div className="flex items-center justify-center gap-2 py-4">
                <svg
                  className="animate-spin h-5 w-5 text-appPrimary"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-sm text-appMuted">Loading more vehicles...</p>
              </div>
            )}

            {/* End of List */}
            {!hasNextPage && vehicles.length > 10 && (
              <div className="text-center py-6">
                <p className="text-sm text-appMuted">You've reached the end of the list</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sheet Form */}
      <VehicleFormSheet
        open={openForm}
        onClose={() => setOpenForm(false)}
        initialData={editVehicle}
        onSuccess={() => {
          refetch();
        }}
      />
    </main>
  );
}
