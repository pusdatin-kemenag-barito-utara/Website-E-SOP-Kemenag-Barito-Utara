import { useState, useEffect } from "react";
import { Activity, SOPHeader, SOPData } from "@/types/sop";
import { DEFAULT_HEADER, INITIAL_ROLES } from "@/lib/constants";

export function useSOPData() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [roles, setRoles] = useState<string[]>(INITIAL_ROLES);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [header, setHeader] = useState<SOPHeader>(DEFAULT_HEADER);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sop-builder-data");
    if (saved) {
      try {
        const parsed: SOPData = JSON.parse(saved);
        // Defer updates to avoid cascading render warnings
        Promise.resolve().then(() => {
          if (parsed.header) setHeader(parsed.header);
          if (parsed.activities) setActivities(parsed.activities);
          if (parsed.roles) setRoles(parsed.roles);
          setIsHydrated(true);
        });
      } catch (e) {
        console.error("Failed to parse saved data", e);
        Promise.resolve().then(() => setIsHydrated(true));
      }
    } else {
      Promise.resolve().then(() => setIsHydrated(true));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isHydrated) {
      const dataToSave: SOPData = { header, activities, roles };
      localStorage.setItem("sop-builder-data", JSON.stringify(dataToSave));
    }
  }, [header, activities, roles, isHydrated]);

  const resetData = () => {
    if (confirm("Reset semua data?")) {
      setActivities([]);
      setRoles(INITIAL_ROLES);
      setHeader(DEFAULT_HEADER);
      localStorage.removeItem("sop-builder-data");
    }
  };

  return {
    isHydrated,
    roles,
    setRoles,
    activities,
    setActivities,
    header,
    setHeader,
    resetData,
  };
}
