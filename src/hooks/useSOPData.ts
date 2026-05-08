import { useState, useEffect, useCallback } from "react";
import { Activity, SOPHeader, SOPData } from "@/types/sop";
import { DEFAULT_HEADER, INITIAL_ROLES } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

export function useSOPData(userId?: string) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [userSops, setUserSops] = useState<
    { id: string; title: string; updated_at: string }[]
  >([]);

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

  // Fetch list of user SOPs
  const fetchUserSops = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("sops")
      .select("id, title, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (data && !error) {
      setUserSops(data);
    }
  }, [userId]);

  useEffect(() => {
    const fetch = async () => {
      await fetchUserSops();
    };
    fetch();
  }, [fetchUserSops]);

  // Auto-save to localStorage
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
        user_id: userId || null,
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
        const newUrl = `${window.location.origin}${window.location.pathname}?id=${newId}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
        fetchUserSops(); // Refresh list
        return { success: true, message: "SOP berhasil disimpan ke Cloud!" };
      }
      return { success: false, message: "Gagal menyimpan." };
    } catch (err) {
      console.error("Cloud sync error:", err);
      return { success: false, message: "Gagal menyimpan ke Cloud." };
    } finally {
      setIsSyncing(false);
    }
  }, [header, activities, roles, isHydrated, currentId, userId, fetchUserSops]);

  const loadSop = async (id: string) => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase
        .from("sops")
        .select("*")
        .eq("id", id)
        .single();

      if (data && !error) {
        setHeader(data.header);
        setActivities(data.activities);
        setRoles(data.roles);
        setCurrentId(data.id);
        const newUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
        return { success: true };
      }
      return { success: false, message: "Gagal memuat SOP." };
    } catch (err) {
      console.error("Load error:", err);
      return { success: false, message: "Terjadi kesalahan." };
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteSop = async (id: string) => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from("sops").delete().eq("id", id);

      if (error) throw error;

      if (currentId === id) {
        setCurrentId(null);
        setActivities([]);
        setRoles(INITIAL_ROLES);
        setHeader(DEFAULT_HEADER);
        const cleanUrl = `${window.location.origin}${window.location.pathname}`;
        window.history.pushState({ path: cleanUrl }, "", cleanUrl);
      }

      fetchUserSops();
      return { success: true, message: "SOP berhasil dihapus." };
    } catch (err) {
      console.error("Delete error:", err);
      return { success: false, message: "Gagal menghapus SOP." };
    } finally {
      setIsSyncing(false);
    }
  };

  const resetData = () => {
    setActivities([]);
    setRoles(INITIAL_ROLES);
    setHeader(DEFAULT_HEADER);
    setCurrentId(null);
    localStorage.removeItem("sop-builder-data");
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.pushState({ path: cleanUrl }, "", cleanUrl);
  };

  return {
    isHydrated,
    isSyncing,
    currentId,
    userSops,
    roles,
    setRoles,
    activities,
    setActivities,
    header,
    setHeader,
    resetData,
    saveToCloud,
    loadSop,
    deleteSop,
  };
}
