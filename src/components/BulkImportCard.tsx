'use client';

import { ImportResponse } from '@/types';
import { useState } from 'react';

type Props = {
  title: string;
  description: string;
  uploadUrl: string;
  templateUrl: string;
};

export default function BulkImportCard({ title, description, uploadUrl, templateUrl }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || 'Upload failed');
      setLoading(false);
      return;
    }

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="bg-appSurface border border-appBorder rounded-xl p-4 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-appText">{title.split('_').join(' ')}</h3>
        <p className="text-sm text-appMuted">{description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={templateUrl}
          className="px-3 py-2 rounded-lg border border-appBorder text-sm hover:bg-appBg"
        >
          Download Template
        </a>

        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm"
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="px-4 py-2 rounded-lg bg-appPrimary text-white disabled:opacity-50"
        >
          {loading ? 'Uploading…' : 'Upload'}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      {/* Summary */}
      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(result.summary).map(([key, value]) => (
              <div key={key} className="bg-appBg rounded-lg p-2 text-center">
                <p className="text-xs text-appMuted capitalize">{key}</p>
                <p className="text-lg font-semibold text-appText">{value}</p>
              </div>
            ))}
          </div>

          {/* Logs */}
          <div className="max-h-64 overflow-auto border border-appBorder rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-appBg sticky top-0">
                <tr>
                  <th className="p-2 text-left">Row</th>
                  {title === 'Import_Vehicles' ? (
                    <th className="p-2 text-left">Vehicle</th>
                  ) : (
                    <th className="p-2 text-left">Apartment</th>
                  )}
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                {result.logs.map((log, i) => (
                  <tr key={i} className="border-t border-appBorder">
                    <td className="p-2">{log.rowNumber}</td>

                    {title === 'Import_Vehicles' ? (
                      <td className="p-2">{log.vehicleNumber || '-'}</td>
                    ) : (
                      <td className="p-2">{log.apartmentName || '-'}</td>
                    )}
                    <td className="p-2 font-medium">{log.status}</td>
                    <td className="p-2 text-appMuted">{log.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-appMuted">Logs are temporary and will reset on refresh.</p>
        </div>
      )}
    </div>
  );
}
