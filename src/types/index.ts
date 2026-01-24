export type VehicleImportLog = {
  rowNumber: number;
  Name?: string;
  vehicleNumber?: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED' | 'RESTORED' | 'INSERTED' | 'UPDATED';
  reason?: string;
  apartmentName?: string;
};

export type ImportSummary = Record<string, number>;

export type ImportResponse = {
  summary: ImportSummary;
  logs: VehicleImportLog[];
};

export type Vehicle = {
  vehicleNumber: string;
  ownerName: string;
  floor: string;
  blockNumber: string;
  ownerMobile: string;

  apartmentName: string;
  pramukhName: string;
  pramukhMobile: string;
  bahadurName: string;
  bahadurMobile: string;
};

export type VehicleFilters = {
  apartmentId: string | null;
  block: string | null;
  floor: string | null;
  search: string | null;
};
