import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Activity, SOPHeader, SOPData } from "@/types/sop";
import { DEFAULT_HEADER, INITIAL_ROLES } from "@/lib/constants";
import { sopsApi } from "@/lib/api";
import { formatIndonesianDate } from "@/lib/utils";

function normalizeHeaderDates(h: SOPHeader): SOPHeader {
  if (!h) return h;
  return {
    ...h,
    tglBuat: h.tglBuat ? formatIndonesianDate(h.tglBuat) : h.tglBuat,
    tglRevisi: h.tglRevisi === "-" ? "-" : (h.tglRevisi ? formatIndonesianDate(h.tglRevisi) : "-"),
    tglEfektif: h.tglEfektif ? formatIndonesianDate(h.tglEfektif) : h.tglEfektif,
  };
}

async function fetchUserSopsFromDb() {
  return sopsApi.listMine();
}

async function fetchAllSopsFromDb() {
  return sopsApi.listAllAdmin();
}

async function fetchSopById(id: string) {
  return sopsApi.get(id);
}

export function useSOPData(userId?: string, userEmail?: string | null) {
  const queryClient = useQueryClient();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [roles, setRoles] = useState<string[]>(INITIAL_ROLES);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [header, setHeader] = useState<SOPHeader>(DEFAULT_HEADER);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Query: User SOPs list
  const {
    data: userSops = [],
  } = useQuery({
    queryKey: ["userSops", userId],
    queryFn: () => fetchUserSopsFromDb(),
    enabled: !!userId,
  });

  // Query: All SOPs (admin)
  const {
    data: allSops = [],
    refetch: refetchAllSops,
  } = useQuery({
    queryKey: ["allSops"],
    queryFn: fetchAllSopsFromDb,
    enabled: false,
  });

  // Mutation: Save to Cloud
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!isHydrated) throw new Error("Not hydrated");

      const basePayload = {
        title: header.namaSOP || "Untitled SOP",
        header,
        activities,
        roles,
      };

      let result;
      if (currentId) {
        result = await sopsApi.update(currentId, basePayload);
      } else {
        result = await sopsApi.create(basePayload);
      }

      return result;
    },
    onSuccess: (data) => {
      if (data) {
        if (!currentId) {
          setCurrentId(data.id);
          const newUrl = `${window.location.origin}${window.location.pathname}?id=${data.id}`;
          window.history.pushState({ path: newUrl }, "", newUrl);
        }
        setLastSaved(new Date());
      }
      queryClient.invalidateQueries({ queryKey: ["userSops"] });
      queryClient.invalidateQueries({ queryKey: ["allSops"] });
    },
  });

  // Mutation: Delete SOP
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await sopsApi.remove(id);
      return id;
    },
    onSuccess: (id) => {
      if (currentId === id) {
        setCurrentId(null);
        setActivities([]);
        setRoles(INITIAL_ROLES);
        setHeader(DEFAULT_HEADER);
        setLastSaved(null);
        const cleanUrl = `${window.location.origin}${window.location.pathname}`;
        window.history.pushState({ path: cleanUrl }, "", cleanUrl);
      }
      queryClient.invalidateQueries({ queryKey: ["userSops"] });
      queryClient.invalidateQueries({ queryKey: ["allSops"] });
    },
  });

  // Load Initial Data (URL ID > LocalStorage > Default)
  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const idFromUrl = params.get("id");

      if (idFromUrl) {
        try {
          const data = await fetchSopById(idFromUrl);
          if (data) {
            setHeader(normalizeHeaderDates(data.header));
            setActivities(data.activities);
            setRoles(data.roles);
            setCurrentId(data.id);
            setLastSaved(new Date(data.updated_at));
            setIsHydrated(true);
            return;
          }
        } catch {
          // Fallback to localStorage
        }
      }

      const saved = localStorage.getItem("sop-builder-data");
      if (saved) {
        try {
          const parsed: SOPData = JSON.parse(saved);
          if (parsed.header) setHeader(normalizeHeaderDates(parsed.header));
          if (parsed.activities) setActivities(parsed.activities);
          if (parsed.roles) setRoles(parsed.roles);
        } catch {}
      }
      setIsHydrated(true);
    };

    init();
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (isHydrated) {
      const dataToSave: SOPData = { header, activities, roles };
      localStorage.setItem("sop-builder-data", JSON.stringify(dataToSave));
    }
  }, [header, activities, roles, isHydrated]);

  // Prevent initial autosave on load if not changed
  const isInitialMount = useRef(true);

  // Auto-save to Cloud (Debounced)
  useEffect(() => {
    if (!isHydrated || !userId) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return; // Skip autosave on the very first render after hydration
    }

    const isDefault = 
      JSON.stringify(header) === JSON.stringify(DEFAULT_HEADER) && 
      JSON.stringify(activities) === JSON.stringify([]) && 
      JSON.stringify(roles) === JSON.stringify(INITIAL_ROLES);

    // Only skip if it's completely new and empty
    if (!currentId && isDefault) return;

    const timer = setTimeout(() => {
      saveMutation.mutate();
    }, 5000); // 5 seconds debounce for autosave

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [header, activities, roles, isHydrated, userId, currentId]);

  const isSyncing = isManualSyncing || saveMutation.isPending || deleteMutation.isPending;

  const saveToCloud = useCallback(async () => {
    if (!isHydrated) return;
    try {
      await saveMutation.mutateAsync();
      return { success: true, message: "SOP berhasil disimpan ke Cloud!" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan.";
      return { success: false, message: msg };
    }
  }, [isHydrated, saveMutation]);

  const loadSop = useCallback(
    async (id: string) => {
      setIsManualSyncing(true);
      try {
        const data = await fetchSopById(id);
        if (data) {
          setHeader(normalizeHeaderDates(data.header));
          setActivities(data.activities);
          setRoles(data.roles);
          setCurrentId(data.id);
          setLastSaved(new Date(data.updated_at));
          const newUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;
          window.history.pushState({ path: newUrl }, "", newUrl);
          return { success: true };
        }
        return { success: false, message: "Gagal memuat SOP." };
      } catch {
        return { success: false, message: "Terjadi kesalahan." };
      } finally {
        setIsManualSyncing(false);
      }
    },
    [],
  );

  const deleteSop = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id);
        return { success: true, message: "SOP berhasil dihapus." };
      } catch {
        return { success: false, message: "Gagal menghapus SOP." };
      }
    },
    [deleteMutation],
  );

  const resetData = useCallback(() => {
    setActivities([]);
    setRoles(INITIAL_ROLES);
    setHeader(DEFAULT_HEADER);
    setCurrentId(null);
    setLastSaved(null);
    localStorage.removeItem("sop-builder-data");
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.pushState({ path: cleanUrl }, "", cleanUrl);
  }, []);

  const previousUserId = useRef(userId || null);
  useEffect(() => {
    if (previousUserId.current !== null && previousUserId.current !== (userId || null)) {
      resetData();
    }
    previousUserId.current = userId || null;
  }, [userId, resetData]);

  const fetchAllSops = useCallback(() => {
    refetchAllSops();
  }, [refetchAllSops]);

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
    fetchAllSops,
    allSops,
    lastSaved,
  };
}
