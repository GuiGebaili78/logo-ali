import { useState } from "react";
import type { ServiceSearchParams, Service } from "../types/services";
import * as api from "../services/api";

export function useSearch() {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function search(params: ServiceSearchParams) {
    setLoading(true);
    setError(null);
    try {
      const result = await api.searchServices(params);
      setServices(result.services ?? []);
      return result;
    } catch (err: any) {
      setError(err?.message ?? "Erro na busca");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    services,
    error,
    search,
    setServices,
  };
}
