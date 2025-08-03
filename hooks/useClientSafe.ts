"use client";

import { useState, useEffect } from "react";

// Hook for safely accessing localStorage without SSR issues
export function useLocalStorage(
  key: string,
  initialValue: string | null = null
) {
  const [storedValue, setStoredValue] = useState<string | null>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValue]);

  const setValue = (value: string | null) => {
    try {
      setStoredValue(value);
      if (value === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isLoading] as const;
}

// Hook for safely checking if we're on the client side
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
