'use client';

import { useState } from 'react';

type ApartmentFormProps = {
  mode: 'create' | 'edit';
  initialData?: {
    id?: string;
    apartmentName: string;
    pramukhName: string;
    pramukhMobile: string;
    bahadurName: string;
    bahadurMobile: string;
  } | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

function ApartmentForm({ mode, initialData, onSuccess, onCancel }: ApartmentFormProps) {
  const isEdit = mode === 'edit' && initialData;
  const [apartmentName, setApartmentName] = useState(isEdit ? initialData!.apartmentName : '');
  const [pramukhName, setPramukhName] = useState(isEdit ? initialData!.pramukhName : '');
  const [pramukhMobile, setPramukhMobile] = useState(isEdit ? initialData!.pramukhMobile : '');
  const [bahadurName, setBahadurName] = useState(isEdit ? initialData!.bahadurName : '');
  const [bahadurMobile, setBahadurMobile] = useState(isEdit ? initialData!.bahadurMobile : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    // Validation
    if (!apartmentName.trim()) {
      setError('Apartment name is required');
      return;
    }
    if (!pramukhName.trim()) {
      setError('Pramukh name is required');
      return;
    }
    if (!pramukhMobile.trim()) {
      setError('Pramukh mobile is required');
      return;
    }
    if (pramukhMobile.trim().length < 10) {
      setError('Pramukh mobile number must be at least 10 digits');
      return;
    }
    if (!bahadurName.trim()) {
      setError('Bahadur name is required');
      return;
    }
    if (!bahadurMobile.trim()) {
      setError('Bahadur mobile is required');
      return;
    }
    if (bahadurMobile.trim().length < 10) {
      setError('Bahadur mobile number must be at least 10 digits');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload = {
      apartmentName: apartmentName.trim(),
      pramukhName: pramukhName.trim(),
      pramukhMobile: pramukhMobile.trim(),
      bahadurName: bahadurName.trim(),
      bahadurMobile: bahadurMobile.trim(),
    };

    const url =
      mode === 'create' ? '/api/admin/apartment' : `/api/admin/apartment/${initialData?.id}`;
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
        setApartmentName('');
        setPramukhName('');
        setPramukhMobile('');
        setBahadurName('');
        setBahadurMobile('');
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
    <div className="space-y-4">
      {/* Success Message */}
      {success && (
        <div className="bg-successLight border border-success rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <svg
            className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-appText">
              {mode === 'create'
                ? 'Apartment added successfully!'
                : 'Apartment updated successfully!'}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-dangerLight border border-danger rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <svg
            className="w-5 h-5 text-danger flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-appText">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="flex-shrink-0 text-danger hover:text-danger/80"
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
        {/* Apartment Name */}
        <div>
          <label htmlFor="apartmentName" className="block text-sm font-medium text-appText mb-1.5">
            Apartment Name <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <input
              id="apartmentName"
              type="text"
              placeholder="e.g., ANJANISUT APARTMENT"
              value={apartmentName}
              onChange={(e) => setApartmentName(e.target.value)}
              className="
                w-full border-2 border-appBorder rounded-lg pl-10 pr-4 py-3
                text-appText bg-white
                focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                transition-all
              "
              disabled={loading}
            />
          </div>
        </div>

        {/* Owner Name */}
        <div>
          <label htmlFor="pramukhName" className="block text-sm font-medium text-appText mb-1.5">
            pramukhName <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <input
              id="pramukhName"
              type="text"
              placeholder="Enter owner's full name"
              value={pramukhName}
              onChange={(e) => setPramukhName(e.target.value)}
              className="
                w-full border-2 border-appBorder rounded-lg pl-10 pr-4 py-3
                text-appText bg-white
                focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                transition-all
              "
              disabled={loading}
            />
          </div>
        </div>

        {/* Pramukh Mobile */}
        <div>
          <label htmlFor="pramukhMobile" className="block text-sm font-medium text-appText mb-1.5">
            Pramukh Mobile <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <input
              id="pramukhMobile"
              type="tel"
              placeholder="Enter Pramukh's mobile number"
              value={pramukhMobile}
              onChange={(e) => setPramukhMobile(e.target.value)}
              className="
                w-full border-2 border-appBorder rounded-lg pl-10 pr-4 py-3
                text-appText bg-white
                focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                transition-all
              "
              disabled={loading}
            />
          </div>
        </div>

        {/* Bahadur Name */}
        <div>
          <label htmlFor="bahadurName" className="block text-sm font-medium text-appText mb-1.5">
            Bahadur Name <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <input
              id="bahadurName"
              type="text"
              placeholder="Enter Bahadur's full name"
              value={bahadurName}
              onChange={(e) => setBahadurName(e.target.value)}
              className="
                w-full border-2 border-appBorder rounded-lg pl-10 pr-4 py-3
                text-appText bg-white
                focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                transition-all
              "
              disabled={loading}
            />
          </div>
        </div>

        {/* Bahadur Mobile */}
        <div>
          <label htmlFor="bahadurMobile" className="block text-sm font-medium text-appText mb-1.5">
            Bahadur Mobile <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <input
              id="bahadurMobile"
              type="tel"
              placeholder="Enter Bahadur's mobile number"
              value={bahadurMobile}
              onChange={(e) => setBahadurMobile(e.target.value)}
              className="
                w-full border-2 border-appBorder rounded-lg pl-10 pr-4 py-3
                text-appText bg-white
                focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                transition-all
              "
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          disabled={loading}
          className="
            flex-1 rounded-lg border-2 border-appBorder
            bg-white text-appText
            py-3 font-semibold text-sm
            hover:bg-appBg
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
            flex-1 rounded-lg bg-appPrimary text-white
            py-3 font-semibold text-sm
            hover:bg-appPrimaryHover active:scale-98
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
            <>
              {mode === 'create' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Apartment
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Update Apartment
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
type Apartment = {
  id: string;
  apartmentName: string;
  pramukhName: string;
  pramukhMobile: string;
  bahadurName: string;
  bahadurMobile: string;
};

export default function ApartmentFormSheet({
  open,
  onClose,
  initialData,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  initialData: Apartment | null;
  onSuccess?: () => void;
}) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-appSurface rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Handle Bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-appBorder rounded-full" />
          </div>

          {/* Header */}
          <div className="px-4 pb-4 border-b border-appBorder flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-appText">
                {initialData ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <p className="text-xs text-appMuted mt-0.5">
                {initialData
                  ? 'Update vehicle information'
                  : 'Register a new vehicle in the system'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-appBg hover:bg-appBorder transition-colors flex items-center justify-center"
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

          {/* Form Content */}
          <div className="p-4">
            <ApartmentForm
              key={initialData?.id ?? 'create'}
              mode={initialData ? 'edit' : 'create'}
              initialData={null}
              onSuccess={onSuccess}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </>
  );
}
