import { useState, useEffect, useCallback } from "react";
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from "../../lib/utils/index";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = getLocalStorage<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to local storage
        if (typeof window !== "undefined") {
          setLocalStorage(key, valueToStore);
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        removeLocalStorage(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Specialized hooks for common use cases
export function useTheme() {
  return useLocalStorage("theme", "light");
}

export function useSidebarCollapsed() {
  return useLocalStorage("sidebar_collapsed", false);
}

export function useDashboardLayout() {
  return useLocalStorage("dashboard_layout", "grid");
}

export function useRecentSearches() {
  return useLocalStorage<string[]>("recent_searches", []);
}

export function useFavoriteMentors() {
  return useLocalStorage<string[]>("favorite_mentors", []);
}

export function useSessionPreferences() {
  return useLocalStorage("session_preferences", {
    duration: 60,
    subject: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}
