export interface CataBagulhoResult {
  street: string;
  startStretch?: string;
  endStretch?: string;
  dates: string[];
  frequency: string;
  shift: string;
  schedule: string;
}

export interface CataBagulhoCacheData {
  id: number;
  latitude: number;
  longitude: number;
  results: CataBagulhoResult[];
  cached_at: Date;
  expires_at: Date;
}