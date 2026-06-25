"use client";

import { useEffect, useState } from "react";
import { fetchCompanyDetails, CompanyDetails } from "@/lib/company_info";

export default function useCompanyDetails() {
  const [data, setData] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCompanyDetails()
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
