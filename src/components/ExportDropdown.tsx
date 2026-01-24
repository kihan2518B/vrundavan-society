// components/ExportDropdown.tsx
'use client';

import { useState } from 'react';
import { VehicleFilters } from '@/types';

type Props = {
  filters: VehicleFilters;
};
function buildQuery(filters: VehicleFilters) {
  const params = new URLSearchParams();

  if (filters.apartmentId) params.set('apartmentId', filters.apartmentId);
  if (filters.block) params.set('block', filters.block);
  if (filters.floor) params.set('floor', filters.floor);
  if (filters.search) params.set('search', filters.search);

  return params.toString();
}

export default function ExportDropdown({ filters }: Props) {
  const [open, setOpen] = useState(false);

  async function exportExcel() {
    const res = await fetch('/api/admin/export/excel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehicles.xlsx';
    a.click();

    window.URL.revokeObjectURL(url);
    setOpen(false);
  }
  function exportPdf() {
    const query = buildQuery(filters);
    window.location.href = `/api/admin/export/pdf${query ? `?${query}` : ''}`;
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2 px-4 py-2.5 rounded-lg
          bg-appSurface border border-appBorder text-appText
          font-medium text-sm hover:bg-appBg
        "
      >
        Export
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white border border-appBorder shadow-card z-20">
          <button
            onClick={exportExcel}
            className="w-full px-4 py-2 text-left text-sm hover:bg-appBg"
          >
            Export as Excel
          </button>

          <button onClick={exportPdf} className="w-full px-4 py-2 text-left text-sm hover:bg-appBg">
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}
