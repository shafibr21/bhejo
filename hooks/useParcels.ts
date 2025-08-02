"use client";

import { useState, useEffect } from "react";

export function useParcels() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParcels = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/parcels", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setParcels(data.parcels || []);
      } else {
        setError("Failed to fetch parcels");
      }
    } catch (error) {
      console.error("Error fetching parcels:", error);
      setError("Error loading parcels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  const refetch = () => {
    fetchParcels();
  };

  return {
    parcels,
    loading,
    error,
    refetch,
  };
}
