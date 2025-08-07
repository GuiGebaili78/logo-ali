export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export interface ViaCepCacheData extends ViaCepResponse {
  id?: number;
  cached_at?: Date;
  expires_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface CacheStatus {
  hit: boolean;
  expired: boolean;
  source: "cache" | "api";
}

export interface ViaCepApiResponse extends ViaCepResponse {
  cacheStatus: CacheStatus;
}
