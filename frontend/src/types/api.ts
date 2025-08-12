export interface NominatimResult {
  place_id: number;
  licence?: string;
  osm_type?: string;
  osm_id?: number;
  boundingbox?: [string, string, string, string];
  lat: string;
  lon: string;
  display_name: string;
  class?: string;
  type?: string;
  importance?: number;
  icon?: string;
  address?: Record<string, any>;
}

export interface BackendServiceSearchResponse {
  services: Array<any>;
  total?: number;
  meta?: Record<string, any>;
}
