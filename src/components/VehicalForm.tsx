'use client';

import { normalizeVehicleNumber } from '@/lib/normalize';
import { useState } from 'react';

type VehicleFormProps = {
  mode: 'create' | 'edit';
  initialData?: {
    id?: string;
    vehicleNumber: string;
    ownerName: string;
    flatNumber: string;
    contactNumber: string;
  };
  onSuccess?: () => void;
};

export default function VehicleForm({ mode, initialData, onSuccess }: VehicleFormProps) {
  const isEdit = mode === 'edit' && initialData;

  const [vehicleNumber, setVehicleNumber] = useState(isEdit ? initialData!.vehicleNumber : '');
  const [ownerName, setOwnerName] = useState(isEdit ? initialData!.ownerName : '');
  const [flatNumber, setFlatNumber] = useState(isEdit ? initialData!.flatNumber : '');
  const [contactNumber, setContactNumber] = useState(isEdit ? initialData!.contactNumber : '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit() {
    if (!vehicleNumber || !ownerName || !flatNumber) {
      setMessage('All fields are required');
      return;
    }

    setLoading(true);
    setMessage(null);

    const payload = {
      vehicleNumber: normalizeVehicleNumber(vehicleNumber),
      ownerName: ownerName.trim(),
      flatNumber: flatNumber.trim(),
      contactNumber: contactNumber.trim(),
    };

    const url = mode === 'create' ? '/api/admin/vehical' : `/api/admin/vehical/${initialData?.id}`;

    const method = mode === 'create' ? 'POST' : 'PATCH';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setMessage('Operation failed');
      setLoading(false);
      return;
    }

    setMessage(mode === 'create' ? 'Vehicle added successfully' : 'Vehicle updated successfully');

    if (mode === 'create') {
      setVehicleNumber('');
      setOwnerName('');
      setFlatNumber('');
      setContactNumber('');
    }

    onSuccess?.();
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <input
        placeholder="Vehicle Number"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
        className="w-full border border-appBorder rounded px-3 py-2 text-appText"
      />

      <input
        placeholder="Owner Name"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        className="w-full border border-appBorder rounded px-3 py-2 text-appText"
      />

      <input
        placeholder="Flat Number"
        value={flatNumber}
        onChange={(e) => setFlatNumber(e.target.value)}
        className="w-full border border-appBorder rounded px-3 py-2 text-appText"
      />
      <input
        placeholder="Contact Number"
        value={contactNumber}
        onChange={(e) => setContactNumber(e.target.value)}
        className="w-full border border-appBorder rounded px-3 py-2 text-appText"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-primary text-black py-2 rounded font-medium disabled:opacity-60"
      >
        {loading ? 'Saving...' : mode === 'create' ? 'Add Vehicle' : 'Update Vehicle'}
      </button>

      {message && <p className="text-sm text-appMuted">{message}</p>}
    </div>
  );
}
