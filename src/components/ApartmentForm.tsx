'use client';

import { Building2, Phone, Shield, HardHat } from 'lucide-react';
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
              {mode === 'create'
                ? 'Apartment Added Successfully!'
                : 'Apartment Updated Successfully!'}
            </p>
            <p className="text-xs text-appMuted mt-0.5">
              {mode === 'create'
                ? 'The apartment has been registered in the system'
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
        {/* Apartment Name */}
        <div>
          <label htmlFor="apartmentName" className="block text-sm font-semibold text-appText mb-2">
            Apartment Name <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Building2 className="w-5 h-5 text-appMuted" />
            </div>
            <input
              id="apartmentName"
              type="text"
              placeholder="Sunshine Residency"
              value={apartmentName}
              onChange={(e) => setApartmentName(e.target.value)}
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
          <p className="text-xs text-appMuted mt-1.5 ml-1">
            Enter the full name of the apartment/society
          </p>
        </div>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-appBorder"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-appSurface text-xs font-semibold text-appMuted uppercase tracking-wider">
              Pramukh Details
            </span>
          </div>
        </div>

        {/* Pramukh Name */}
        <div>
          <label htmlFor="pramukhName" className="block text-sm font-semibold text-appText mb-2">
            Pramukh Name <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Shield className="w-5 h-5 text-appMuted" />
            </div>
            <input
              id="pramukhName"
              type="text"
              placeholder="Enter Pramukh's full name"
              value={pramukhName}
              onChange={(e) => setPramukhName(e.target.value)}
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

        {/* Pramukh Mobile */}
        <div>
          <label htmlFor="pramukhMobile" className="block text-sm font-semibold text-appText mb-2">
            Pramukh Mobile <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Phone className="w-5 h-5 text-appMuted" />
            </div>
            <input
              id="pramukhMobile"
              type="tel"
              placeholder="9876543210"
              value={pramukhMobile}
              onChange={(e) => setPramukhMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
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

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-appBorder"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-appSurface text-xs font-semibold text-appMuted uppercase tracking-wider">
              Bahadur Details
            </span>
          </div>
        </div>

        {/* Bahadur Name */}
        <div>
          <label htmlFor="bahadurName" className="block text-sm font-semibold text-appText mb-2">
            Bahadur Name <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <HardHat className="w-5 h-5 text-appMuted" />
            </div>
            <input
              id="bahadurName"
              type="text"
              placeholder="Enter Bahadur's full name"
              value={bahadurName}
              onChange={(e) => setBahadurName(e.target.value)}
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

        {/* Bahadur Mobile */}
        <div>
          <label htmlFor="bahadurMobile" className="block text-sm font-semibold text-appText mb-2">
            Bahadur Mobile <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Phone className="w-5 h-5 text-appMuted" />
            </div>
            <input
              id="bahadurMobile"
              type="tel"
              placeholder="9876543210"
              value={bahadurMobile}
              onChange={(e) => setBahadurMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
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
            <>{mode === 'create' ? 'Add Apartment' : 'Update Apartment'}</>
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
  initialData: Apartment | undefined;
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
                  <Building2
                    className={`w-6 h-6 ${initialData ? 'text-appPrimary' : 'text-success'}`}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-appText">
                    {initialData ? 'Edit Apartment' : 'Add New Apartment'}
                  </h2>
                  <p className="text-xs text-appMuted mt-0.5">
                    {initialData
                      ? 'Update apartment information'
                      : 'Register a new apartment in the system'}
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
            <ApartmentForm
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
