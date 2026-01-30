'use client';

import { useApartments } from '@/hooks/useApartment';
import { normalizeVehicleNumber } from '@/lib/normalize';
import { useState } from 'react';
import { Car, User, Building2, Hash, Phone } from 'lucide-react';

type VehicleFormProps = {
  mode: 'create' | 'edit';
  initialData?: {
    id?: string;
    vehicleNumber: string;
    ownerName: string;
    blockNumber: string;
    floor: string;
    contactNumber: string;
    apartmentId: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
};

function VehicleForm({ mode, initialData, onSuccess, onCancel }: VehicleFormProps) {
  const isEdit = mode === 'edit' && initialData;
  const [vehicleNumber, setVehicleNumber] = useState(isEdit ? initialData!.vehicleNumber : '');
  const [ownerName, setOwnerName] = useState(isEdit ? initialData!.ownerName : '');
  const [blockNumber, setBlockNumber] = useState(isEdit ? initialData!.blockNumber : '');
  const [floor, setFloor] = useState(isEdit ? String(initialData!.floor) : '');
  const [contactNumber, setContactNumber] = useState(isEdit ? initialData!.contactNumber : '');
  const [apartmentId, setApartmentId] = useState(isEdit ? initialData!.apartmentId : '1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: apartments, isLoading: isApartmentLoading } = useApartments();
  async function handleSubmit() {
    // Validation
    if (!vehicleNumber.trim()) {
      setError('Vehicle number is required');
      return;
    }
    if (!ownerName.trim()) {
      setError('Owner name is required');
      return;
    }
    if (!blockNumber.trim()) {
      setError('Flat/House number is required');
      return;
    }
    if (!contactNumber.trim()) {
      setError('Contact number is required');
      return;
    }
    if (!floor.trim()) {
      setError('Floor is required');
      return;
    }

    if (!apartmentId) {
      setError('Apartment is required');
      return;
    }
    if (!contactNumber.trim() || contactNumber.trim().length !== 10) {
      setError('Enter a valid 10-digit contact number');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload = {
      vehicleNumber: normalizeVehicleNumber(vehicleNumber),
      ownerName: ownerName.trim(),
      blockNumber: blockNumber.trim(),
      floor: floor.trim(),
      contactNumber: contactNumber.trim(),
      apartmentId: apartmentId,
    };

    const url = mode === 'create' ? '/api/admin/vehicle' : `/api/admin/vehicle/${initialData?.id}`;
    const method = mode === 'create' ? 'POST' : 'PATCH';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Operation failed. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(true);

      // Clear form if creating
      if (mode === 'create') {
        setVehicleNumber('');
        setOwnerName('');
        setBlockNumber('');
        setContactNumber('');
      }

      // Call success callback after a brief delay to show success message
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Success Message */}
      {success && (
        <div className="bg-successLight border-l-4 border-success rounded-lg p-4 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-appText">
              {mode === 'create' ? 'Vehicle Added Successfully!' : 'Vehicle Updated Successfully!'}
            </p>
            <p className="text-xs text-appMuted mt-0.5">
              {mode === 'create'
                ? 'The vehicle has been registered in the system'
                : 'Changes have been saved'}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-dangerLight border-l-4 border-danger rounded-lg p-4 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-danger flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">!</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-appText">Error</p>
            <p className="text-xs text-appMuted mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="flex-shrink-0 text-danger hover:text-danger/70 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Vehicle Number */}
        <div>
          <label htmlFor="vehicleNumber" className="block text-sm font-semibold text-appText mb-2">
            Vehicle Number <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Car className="w-5 h-5 text-appMuted" />
            </div>
            <input
              id="vehicleNumber"
              type="text"
              placeholder="GJ01AB1234"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              className="
                w-full border-2 border-appBorder rounded-xl pl-11 pr-4 py-3.5
                text-appText font-medium bg-white uppercase
                focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                placeholder:text-appMuted/50 placeholder:font-normal placeholder:normal-case
                transition-all
              "
              disabled={loading}
            />
          </div>
          <p className="text-xs text-appMuted mt-1.5 ml-1">Enter the vehicle registration number</p>
        </div>

        {/* Owner Name */}
        <div>
          <label htmlFor="ownerName" className="block text-sm font-semibold text-appText mb-2">
            Owner Name <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <User className="w-5 h-5 text-appMuted" />
            </div>
            <input
              id="ownerName"
              type="text"
              placeholder="Enter full name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="
                w-full border-2 border-appBorder rounded-xl pl-11 pr-4 py-3.5
                text-appText font-medium bg-white
                focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                placeholder:text-appMuted/50 placeholder:font-normal
                transition-all
              "
              disabled={loading}
            />
          </div>
        </div>

        {/* Apartment */}
        <div>
          <label htmlFor="apartmentId" className="block text-sm font-semibold text-appText mb-2">
            Apartment <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none z-10">
              <Building2 className="w-5 h-5 text-appMuted" />
            </div>
            <select
              id="apartmentId"
              value={apartmentId ?? ''}
              onChange={(e) => setApartmentId(e.target.value)}
              className="
                w-full border-2 border-appBorder rounded-xl pl-11 pr-10 py-3.5
                text-appText font-medium bg-white
                focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                transition-all appearance-none cursor-pointer
              "
              disabled={loading || isApartmentLoading}
            >
              <option value="" disabled>
                Select Apartment
              </option>
              {isApartmentLoading && (
                <option value="" disabled>
                  Loading...
                </option>
              )}
              {apartments?.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {apt.apartmentName}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-appMuted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Block and Floor - Side by Side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Block Number */}
          <div>
            <label htmlFor="blockNumber" className="block text-sm font-semibold text-appText mb-2">
              Block <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Hash className="w-5 h-5 text-appMuted" />
              </div>
              <input
                id="blockNumber"
                type="text"
                placeholder="A-101"
                value={blockNumber}
                onChange={(e) => setBlockNumber(e.target.value)}
                className="
                  w-full border-2 border-appBorder rounded-xl pl-11 pr-4 py-3.5
                  text-appText font-medium bg-white
                  focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                  placeholder:text-appMuted/50 placeholder:font-normal
                  transition-all
                "
                disabled={loading}
              />
            </div>
          </div>

          {/* Floor */}
          <div>
            <label htmlFor="floor" className="block text-sm font-semibold text-appText mb-2">
              Floor <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <svg
                  className="w-5 h-5 text-appMuted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </div>
              <input
                id="floor"
                type="text"
                placeholder="3"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="
                  w-full border-2 border-appBorder rounded-xl pl-11 pr-4 py-3.5
                  text-appText font-medium bg-white
                  focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                  placeholder:text-appMuted/50 placeholder:font-normal
                  transition-all
                "
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Contact Number */}
        <div>
          <label htmlFor="contactNumber" className="block text-sm font-semibold text-appText mb-2">
            Contact Number <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Phone className="w-5 h-5 text-appMuted" />
            </div>
            <input
              id="contactNumber"
              type="tel"
              placeholder="9876543210"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="
                w-full border-2 border-appBorder rounded-xl pl-11 pr-4 py-3.5
                text-appText font-medium bg-white
                focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                placeholder:text-appMuted/50 placeholder:font-normal
                transition-all
              "
              disabled={loading}
              maxLength={10}
            />
          </div>
          <p className="text-xs text-appMuted mt-1.5 ml-1">10-digit mobile number without +91</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="
            flex-1 rounded-xl border-2 border-appBorder
            bg-white text-appText
            py-3.5 font-bold text-sm
            hover:bg-appBg hover:border-appMuted
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all
          "
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
            flex-1 rounded-xl bg-gradient-to-r from-appPrimary to-apaxhubDark text-white
            py-3.5 font-bold text-sm
            hover:shadow-cardHover active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-button transition-all
            flex items-center justify-center gap-2
          "
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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
              Saving...
            </>
          ) : (
            <>{mode === 'create' ? 'Add Vehicle' : 'Update Vehicle'}</>
          )}
        </button>
      </div>
    </div>
  );
}
type Vehicle = {
  id: string;
  vehicleNumber: string;
  ownerName: string;
  blockNumber: string;
  floor: string;
  contactNumber: string;
  apartmentId: string;
};

export default function VehicleFormSheet({
  open,
  onClose,
  initialData,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  initialData: Vehicle | undefined;
  onSuccess?: () => void;
}) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50">
        <div className="bg-appSurface rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
          {/* Handle Bar */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1.5 bg-appBorder rounded-full" />
          </div>

          {/* Header */}
          <div className="px-5 pb-5 border-b border-appBorder">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${initialData ? 'bg-appPrimaryLight' : 'bg-successLight'}`}
                >
                  <Car className={`w-6 h-6 ${initialData ? 'text-appPrimary' : 'text-success'}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-appText">
                    {initialData ? 'Edit Vehicle' : 'Add New Vehicle'}
                  </h2>
                  <p className="text-xs text-appMuted mt-0.5">
                    {initialData
                      ? 'Update vehicle information'
                      : 'Register a new vehicle in the system'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-appBg hover:bg-appBorder transition-colors flex items-center justify-center flex-shrink-0 ml-2"
                aria-label="Close"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-5">
            <VehicleForm
              key={initialData?.id ?? 'create'}
              mode={initialData ? 'edit' : 'create'}
              initialData={initialData}
              onSuccess={onSuccess}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </>
  );
}
