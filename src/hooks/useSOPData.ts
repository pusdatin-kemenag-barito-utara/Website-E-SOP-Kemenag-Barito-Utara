import { useState, useEffect, useCallback } from "react";
import { Activity, SOPHeader, SOPData } from "@/types/sop";
import { DEFAULT_HEADER, INITIAL_ROLES } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

export function useSOPData() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [roles, setRoles] = useState<string[]>(INITIAL_ROLES);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [header, setHeader] = useState<SOPHeader>(DEFAULT_HEADER);

  // Load Initial Data (URL ID > LocalStorage > Default)
  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const idFromUrl = params.get("id");

      if (idFromUrl) {
        // 1. Try loading from Supabase first
        const { data, error } = await supabase
          .from("sops")
          .select("*")
          .eq("id", idFromUrl)
          .single();

        if (data && !error) {
          setHeader(data.header);
          setActivities(data.activities);
          setRoles(data.roles);
          setCurrentId(data.id);
          setIsHydrated(true);
          return;
        }
      }

      // 2. Fallback to LocalStorage
      const saved = localStorage.getItem("sop-builder-data");
      if (saved) {
        try {
          const parsed: SOPData = JSON.parse(saved);
          if (parsed.header) setHeader(parsed.header);
          if (parsed.activities) setActivities(parsed.activities);
          if (parsed.roles) setRoles(parsed.roles);
        } catch (e) {
          console.error("Failed to parse saved data", e);
        }
      }
      setIsHydrated(true);
    };

    init();
  }, []);

  // Auto-save to localStorage only (Cloud save is manual for now)
  useEffect(() => {
    if (isHydrated) {
      const dataToSave: SOPData = { header, activities, roles };
      localStorage.setItem("sop-builder-data", JSON.stringify(dataToSave));
    }
  }, [header, activities, roles, isHydrated]);

  const saveToCloud = useCallback(async () => {
    if (!isHydrated) return;
    setIsSyncing(true);

    try {
      const payload = {
        title: header.namaSOP || "Untitled SOP",
        header,
        activities,
        roles,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (currentId) {
        // Update existing
        result = await supabase
          .from("sops")
          .update(payload)
          .eq("id", currentId)
          .select()
          .single();
      } else {
        // Create new
        result = await supabase.from("sops").insert(payload).select().single();
      }

      if (result.error) throw result.error;

      if (result.data) {
        const newId = result.data.id;
        setCurrentId(newId);
        // Update URL without refreshing
        const newUrl = `${window.location.origin}${window.location.pathname}?id=${newId}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
        alert("SOP berhasil disimpan ke Cloud!");
      }
    } catch (err) {
      console.error("Cloud sync error:", err);
      alert("Gagal menyimpan ke Cloud. Pastikan Supabase sudah diatur.");
    } finally {
      setIsSyncing(false);
    }
  }, [header, activities, roles, isHydrated, currentId]);

  const resetData = () => {
    if (confirm("Reset semua data? Ini akan menghapus data lokal Anda.")) {
      setActivities([]);
      setRoles(INITIAL_ROLES);
      setHeader(DEFAULT_HEADER);
      setCurrentId(null);
      localStorage.removeItem("sop-builder-data");
      // Clear URL
      const cleanUrl = `${window.location.origin}${window.location.pathname}`;
      window.history.pushState({ path: cleanUrl }, "", cleanUrl);
    }
  };

  return {
    isHydrated,
    isSyncing,
    currentId,
    roles,
    setRoles,
    activities,
    setActivities,
    header,
    setHeader,
    resetData,
    saveToCloud,
  };
}
