'use client';

import { useEffect, useState } from 'react';
import VehicleForm from '@/components/VehicalForm';
const logout = async () => {
  await fetch('/api/logout', {
    method: 'POST',
  });
  window.location.href = '/';
};

type Vehicle = {
  id: string;
  vehicleNumber: string;
  ownerName: string;
  flatNumber: string;
  contactNumber: string;
  createdAt: string;
};

export default function AdminPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null | undefined>(null);

  async function reloadVehicles() {
    const res = await fetch('/api/admin/vehical');
    const data = await res.json();
    setVehicles(data.data);
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchVehicles() {
      const res = await fetch('/api/admin/vehical');
      const data = await res.json();

      if (!cancelled) {
        setVehicles(data.data);
      }
    }

    fetchVehicles();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Admin – Vehicles</h1>

        <button
          onClick={() => {
            setEditVehicle(null);
            setShowDialog(true);
          }}
          className="bg-primary text-black px-4 py-2 rounded font-medium"
        >
          Add Vehicle
        </button>
        <button
          onClick={() => {
            logout();
          }}
          className="bg-primary text-black px-4 py-2 rounded font-medium"
        >
          Logout
        </button>
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-appSurface rounded-lg p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">{editVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
              <button onClick={() => setShowDialog(false)}>✕</button>
            </div>

            <VehicleForm
              mode={editVehicle ? 'edit' : 'create'}
              initialData={editVehicle || undefined}
              onSuccess={reloadVehicles}
            />
          </div>
        </div>
      )}

      {/* Vehicle List */}
      <table className="w-full border border-appBorder text-sm">
        <thead className="bg-appSurface">
          <tr>
            <th className="border p-2 text-left">Vehicle</th>
            <th className="border p-2 text-left">Owner</th>
            <th className="border p-2 text-left">Flat</th>
            <th className="border p-2"></th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td className="border p-2">{v.vehicleNumber}</td>
              <td className="border p-2">{v.ownerName}</td>
              <td className="border p-2">{v.flatNumber}</td>
              <td className="border p-2 text-right">
                <button
                  onClick={() => {
                    setEditVehicle(v);
                    setShowDialog(true);
                  }}
                  className="underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
