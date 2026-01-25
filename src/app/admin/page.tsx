// 'use client';

// import { useInfiniteQuery } from '@tanstack/react-query';
// import { useEffect, useRef, useState } from 'react';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import { TrashIcon } from 'lucide-react';

// import VehicleFormSheet from '@/components/VehicleForm';
// import ApartmentFormSheet from '@/components/ApartmentForm';
// import BulkImportCard from '@/components/BulkImportCard';
// import ExportDropdown from '@/components/ExportDropdown';

// import { VehicleFilters } from '@/types';
// import { useApartments } from '@/hooks/useApartment';

// /* ----------------------------- Types ----------------------------- */
// type Vehicle = {
//   id: string;
//   vehicleNumber: string;
//   ownerName: string;
//   blockNumber: string;
//   floor: string;
//   contactNumber: string;
// };

// /* ----------------------------- Utils ----------------------------- */
// function buildQuery(filters: VehicleFilters, cursor?: string) {
//   const params = new URLSearchParams();

//   if (filters.apartmentId) params.set('apartmentId', filters.apartmentId);
//   if (filters.block) params.set('block', filters.block);
//   if (filters.floor) params.set('floor', filters.floor);
//   if (filters.search) params.set('search', filters.search);
//   if (cursor) params.set('cursor', cursor);

//   params.set('limit', '20');
//   return params.toString();
// }

// async function fetchVehicles({
//   pageParam,
//   filters,
// }: {
//   pageParam?: string;
//   filters: VehicleFilters;
// }) {
//   try {
//     const query = buildQuery(filters, pageParam);
//     const res = await fetch(`/api/admin/vehicle?${query}`);

//     if (!res.ok) {
//       throw new Error('Fetch failed');
//     }

//     return await res.json();
//   } catch (error) {
//     toast.error('Failed to load vehicles');
//     throw error;
//   }
// }

// async function deleteVehicle(id: string, onSuccess: () => void) {
//   const confirmed = window.confirm('Delete this vehicle permanently?');
//   if (!confirmed) return;

//   const toastId = toast.loading('Deleting vehicle...');

//   try {
//     const res = await fetch(`/api/admin/vehicle/${id}`, {
//       method: 'DELETE',
//     });

//     if (!res.ok) {
//       throw new Error();
//     }

//     toast.success('Vehicle deleted', { id: toastId });
//     onSuccess();
//   } catch {
//     toast.error('Failed to delete vehicle', { id: toastId });
//   }
// }

// /* ----------------------------- Page ----------------------------- */
// export default function AdminPage() {
//   const [openVehicleForm, setOpenVehicleForm] = useState(false);
//   const [openApartmentForm, setOpenApartmentForm] = useState(false);
//   const [openBulkImport, setOpenBulkImport] = useState(false);
//   const [editVehicle, setEditVehicle] = useState<Vehicle | undefined>();

//   const [filters, setFilters] = useState<VehicleFilters>({
//     apartmentId: null,
//     block: null,
//     floor: null,
//     search: null,
//   });

//   const { data: apartments } = useApartments();

//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch } =
//     useInfiniteQuery({
//       queryKey: ['vehicles', filters],
//       queryFn: ({ pageParam }) => fetchVehicles({ pageParam, filters }),
//       getNextPageParam: (lastPage) => lastPage.nextCursor,
//       initialPageParam: undefined,
//       staleTime: 5 * 60 * 1000,
//     });

//   const loadMoreRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (!hasNextPage || !loadMoreRef.current) return;
//     const observer = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) fetchNextPage();
//     });
//     observer.observe(loadMoreRef.current);
//     return () => observer.disconnect();
//   }, [hasNextPage, fetchNextPage]);

//   const vehicles: Vehicle[] = data?.pages.flatMap((p) => p.data) ?? [];

//   /* ----------------------------- UI ----------------------------- */
//   return (
//     <main className="min-h-screen bg-appBg flex flex-col">
//       {/* HEADER */}
//       <header className="sticky top-0 z-20 bg-appSurface border-b border-appBorder shadow-card">
//         <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
//           {/* Title Row */}
//           <div className="flex items-center gap-3">
//             <Link
//               href="/"
//               className="w-9 h-9 flex items-center justify-center rounded-lg bg-appBg hover:bg-appBorder"
//             >
//               ←
//             </Link>

//             <div className="flex-1">
//               <h1 className="text-lg font-semibold text-appText">Vehicle Management</h1>
//               <p className="text-xs text-appMuted">
//                 {status === 'success' ? `${vehicles.length} vehicles` : 'Loading…'}
//               </p>
//             </div>
//             <button
//               onClick={() => setOpenApartmentForm(true)}
//               className="px-4 py-2 rounded-lg bg-appPrimaryLight text-appPrimary text-sm font-medium"
//             >
//               + Apartment
//             </button>
//             <button
//               onClick={() => {
//                 setEditVehicle(undefined);
//                 setOpenVehicleForm(true);
//               }}
//               className="px-4 py-2 rounded-lg bg-appPrimary text-white text-sm font-medium"
//             >
//               + Vehicle
//             </button>

//             <ExportDropdown filters={filters} />

//             <button
//               onClick={() => setOpenBulkImport(true)}
//               className="px-3 py-2 rounded-lg border border-appBorder text-appMuted text-sm"
//             >
//               ⋯
//             </button>
//           </div>

//           {/* FILTER BAR */}
//           <div className="bg-appBg/50 border border-appBorder rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
//             <input
//               placeholder="Search vehicle"
//               className="px-3 py-2 rounded-lg border border-appBorder text-sm"
//               value={filters.search ?? ''}
//               onChange={(e) =>
//                 setFilters((f) => ({
//                   ...f,
//                   search: e.target.value || null,
//                 }))
//               }
//             />

//             <select
//               value={filters.apartmentId ?? ''}
//               onChange={(e) =>
//                 setFilters((f) => ({
//                   ...f,
//                   apartmentId: e.target.value || null,
//                 }))
//               }
//               className="px-3 py-2 rounded-lg border border-appBorder text-sm"
//             >
//               <option value="">All Apartments</option>
//               {apartments?.map((apt) => (
//                 <option key={apt.id} value={apt.id}>
//                   {apt.apartmentName}
//                 </option>
//               ))}
//             </select>

//             <input
//               placeholder="Block"
//               className="px-3 py-2 rounded-lg border border-appBorder text-sm"
//               value={filters.block ?? ''}
//               onChange={(e) =>
//                 setFilters((f) => ({
//                   ...f,
//                   block: e.target.value || null,
//                 }))
//               }
//             />

//             <input
//               placeholder="Floor"
//               className="px-3 py-2 rounded-lg border border-appBorder text-sm"
//               value={filters.floor ?? ''}
//               onChange={(e) =>
//                 setFilters((f) => ({
//                   ...f,
//                   floor: e.target.value || null,
//                 }))
//               }
//             />
//           </div>
//         </div>
//       </header>

//       {/* TABLE */}
//       <section className="flex-1 max-w-5xl mx-auto w-full px-4 py-4">
//         {status === 'success' && vehicles.length === 0 && (
//           <p className="text-center text-appMuted py-20">No vehicles match the current filters</p>
//         )}

// {vehicles.length > 0 && (
//   <div className="overflow-x-auto">
//     <table className="min-w-full bg-appSurface border border-appBorder rounded-lg overflow-hidden">
//       <thead className="bg-appBg text-xs text-appMuted">
//         <tr>
//           <th className="px-4 py-3 text-left">Vehicle</th>
//           <th className="px-4 py-3 text-left hidden sm:table-cell">Owner</th>
//           <th className="px-4 py-3 text-left hidden sm:table-cell">Block</th>
//           <th className="px-4 py-3 text-left hidden sm:table-cell">Floor</th>
//           <th className="px-4 py-3 text-left">Mobile</th>
//           <th className="px-4 py-3 text-right">Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {vehicles.map((v) => (
//           <tr key={v.id} className="border-t border-appBorder hover:bg-appBg">
//             <td className="px-4 py-3 font-medium text-appText">
//               {v.vehicleNumber}
//               <div className="sm:hidden text-xs text-appMuted">
//                 {v.ownerName} • Block {v.blockNumber} • Floor {v.floor}
//               </div>
//             </td>

//             <td className="px-4 py-3 hidden sm:table-cell">{v.ownerName}</td>
//             <td className="px-4 py-3 hidden sm:table-cell">{v.blockNumber}</td>
//             <td className="px-4 py-3 hidden sm:table-cell">{v.floor}</td>

//             <td className="px-4 py-3">{v.contactNumber}</td>

//             <td className="px-4 py-3 text-right flex justify-end items-center gap-4">
//               <button
//                 onClick={() => deleteVehicle(v.id, refetch)}
//                 className="text-danger hover:text-danger"
//                 title="Delete"
//               >
//                 <TrashIcon className="w-4 h-4" />
//               </button>

//               <button
//                 onClick={() => {
//                   setEditVehicle(v);
//                   setOpenVehicleForm(true);
//                 }}
//                 className="text-sm text-appPrimary"
//               >
//                 Edit
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// )}

//         {hasNextPage && <div ref={loadMoreRef} className="h-6" />}

//         {isFetchingNextPage && (
//           <p className="text-center text-sm text-appMuted py-4">Loading more…</p>
//         )}
//       </section>

//       {/* FORMS */}
//       <VehicleFormSheet
//         open={openVehicleForm}
//         onClose={() => setOpenVehicleForm(false)}
//         initialData={editVehicle}
//         onSuccess={() => {
//           toast.success(editVehicle ? 'Vehicle updated' : 'Vehicle added');
//           refetch();
//         }}
//       />

//       <ApartmentFormSheet
//         open={openApartmentForm}
//         onClose={() => setOpenApartmentForm(false)}
//         initialData={null}
//         onSuccess={() => toast.success('Apartment saved')}
//       />

//       {/* BULK IMPORT MODAL */}
//       {openBulkImport && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-appSurface rounded-xl p-6 w-full max-w-xl space-y-6">
//             <div className="flex justify-between items-center">
//               <h2 className="font-semibold text-appText">Bulk Import</h2>
//               <button onClick={() => setOpenBulkImport(false)}>✕</button>
//             </div>

//             <BulkImportCard
//               title="Import Apartments"
//               description="Upload Excel to add or update apartments"
//               uploadUrl="/api/admin/import/apartments"
//               templateUrl="/template/apartment_template.xlsx"
//             />

//             <BulkImportCard
//               title="Import Vehicles"
//               description="Upload Excel to add vehicles"
//               uploadUrl="/api/admin/import/vehicles"
//               templateUrl="/template/vehicle_template.xlsx"
//             />
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { TrashIcon, Building2, Car, X, Import } from 'lucide-react';

import VehicleFormSheet from '@/components/VehicleForm';
import ApartmentFormSheet from '@/components/ApartmentForm';
import BulkImportCard from '@/components/BulkImportCard';
import ExportDropdown from '@/components/ExportDropdown';
import ApartmentTable from '@/components/ApartmentTable';

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
type Apartment = {
  id: string;
  apartmentName: string;
  bahadurName: string;
  bahadurMobile: string;
  pramukhName: string;
  pramukhMobile: string;
};
/* ----------------------------- Utils ----------------------------- */
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

async function deleteVehicle(id: string, onSuccess: () => void) {
  if (!confirm('Delete this vehicle permanently?')) return;

  const t = toast.loading('Deleting vehicle...');
  try {
    const res = await fetch(`/api/admin/vehicle/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    toast.success('Vehicle deleted', { id: t });
    onSuccess();
  } catch {
    toast.error('Delete failed', { id: t });
  }
}

/* ----------------------------- Page ----------------------------- */
export default function AdminPage() {
  const [view, setView] = useState<'vehicle' | 'apartment'>('vehicle');

  const [openVehicleForm, setOpenVehicleForm] = useState(false);
  const [openApartmentForm, setOpenApartmentForm] = useState(false);
  const [openBulkImport, setOpenBulkImport] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | undefined>();
  const [editApartment, setEditApartment] = useState<Apartment | undefined>();

  const [filters, setFilters] = useState<VehicleFilters>({
    apartmentId: null,
    block: null,
    floor: null,
    search: null,
  });

  const { data: apartments } = useApartments();

  const { data, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['vehicles', filters],
    queryFn: ({ pageParam }) => fetchVehicles({ pageParam, filters }),
    enabled: view === 'vehicle',
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current || view !== 'vehicle') return;
    const observer = new IntersectionObserver((e) => e[0].isIntersecting && fetchNextPage());
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, view]);

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

            <h1 className="flex-1 font-semibold text-appText">Management</h1>

            <ExportDropdown filters={filters} view={view} />

            <button
              onClick={() => setOpenBulkImport(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg
          bg-appSurface border border-appBorder text-appText
          font-medium text-sm hover:bg-appBg max-[400px]:hidden"
            >
              Import
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </button>
            <button
              onClick={() => setOpenBulkImport(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg
          bg-appSurface border border-appBorder text-appText
          font-medium text-sm hover:bg-appBg min-[400px]:hidden"
            >
              <Import />
            </button>
          </div>

          {/* VIEW SWITCH */}
          <div className="flex rounded-lg border border-appBorder overflow-hidden">
            <button
              onClick={() => setView('vehicle')}
              className={`flex-1 px-3 py-2 text-sm flex items-center justify-center gap-2 ${
                view === 'vehicle' ? 'bg-appPrimary text-white' : 'bg-appSurface text-appMuted'
              }`}
            >
              <Car className="w-4 h-4" /> Vehicles
            </button>

            <button
              onClick={() => setView('apartment')}
              className={`flex-1 px-3 py-2 text-sm flex items-center justify-center gap-2 ${
                view === 'apartment' ? 'bg-appPrimary text-white' : 'bg-appSurface text-appMuted'
              }`}
            >
              <Building2 className="w-4 h-4" /> Apartments
            </button>
          </div>

          {/* VEHICLE FILTERS */}
          {view === 'vehicle' && (
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
          )}
        </div>
      </header>

      {/* CONTENT */}
      <section className="flex-1 max-w-5xl mx-auto w-full px-4 py-4">
        {view === 'vehicle' && (
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
                      <th className="px-4 py-3 text-right">Action</th>
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

                        <td className="px-4 py-3 text-right flex justify-end items-center gap-4">
                          <button
                            onClick={() => deleteVehicle(v.id, refetch)}
                            className="text-danger hover:text-danger"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setEditVehicle(v);
                              setOpenVehicleForm(true);
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
            )}
          </>
        )}

        {view === 'apartment' && (
          <ApartmentTable
            setEditApartment={setEditApartment}
            setOpenApartmentForm={setOpenApartmentForm}
          />
        )}
      </section>

      {/* FORMS */}
      <VehicleFormSheet
        open={openVehicleForm}
        onClose={() => setOpenVehicleForm(false)}
        initialData={editVehicle}
        onSuccess={() => {
          toast.success(editVehicle ? 'Vehicle updated' : 'Vehicle added');
          refetch();
        }}
      />

      <ApartmentFormSheet
        open={openApartmentForm}
        onClose={() => setOpenApartmentForm(false)}
        initialData={editApartment}
        onSuccess={() => toast.success('Apartment saved')}
      />

      {/* BULK IMPORT */}
      {openBulkImport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-appSurface rounded-xl p-6 w-full max-w-xl space-y-6">
            <div className=" w-full flex items-center justify-between">
              <h1 className="font-semibold text-appText">Bulk Import</h1>
              <X className="w-6 h-6 cursor-pointer" onClick={() => setOpenBulkImport(false)} />
            </div>
            <BulkImportCard
              title="Import Apartments"
              description="Upload Excel to add or update apartments"
              uploadUrl="/api/admin/import/apartments"
              templateUrl="/template/apartment_template.xlsx"
            />
            <BulkImportCard
              title="Import Vehicles"
              description="Upload Excel to add vehicles"
              uploadUrl="/api/admin/import/vehicles"
              templateUrl="/template/vehicle_template.xlsx"
            />
          </div>
        </div>
      )}
    </main>
  );
}
