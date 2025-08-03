"use client";

import { useLocalStorage } from "./useClientSafe";

// Hook for safely getting auth token
export function useAuthToken() {
  const [token] = useLocalStorage("token", null);
  return token;
}

// Hook that returns a function to safely get token (for use in event handlers)
export function useGetAuthToken() {
  return () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };
}
