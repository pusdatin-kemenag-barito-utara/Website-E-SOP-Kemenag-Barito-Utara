import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Activity, SOPHeader, SOPData, AdminSOPListItem } from "@/types/sop";
import { DEFAULT_HEADER, INITIAL_ROLES } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { validateSOPData } from "@/lib/schemas";

async function fetchUserSopsFromDb(userId: string) {
  const { data, error } = await supabase
    .from("sops")
    .select("id, title, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

async function fetchAllSopsFromDb() {
  const { data, error } = await supabase
    .from("sops")
    .select("id, title, updated_at, user_id, user_email, header")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as AdminSOPListItem[];
}

async function fetchSopById(id: string) {
  const { data, error } = await supabase
    .from("sops")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export function useSOPData(userId?: string, userEmail?: string | null) {
  const queryClient = useQueryClient();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [roles, setRoles] = useState<string[]>(INITIAL_ROLES);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [header, setHeader] = useState<SOPHeader>(DEFAULT_HEADER);

  // Query: User SOPs list
  const {
    data: userSops = [],
    refetch: refetchUserSops,
  } = useQuery({
    queryKey: ["userSops", userId],
    queryFn: () => fetchUserSopsFromDb(userId!),
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

      const payload = {
        title: header.namaSOP || "Untitled SOP",
        header,
        activities,
        roles,
        user_id: userId || null,
        user_email: userEmail || null,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (currentId) {
        result = await supabase
          .from("sops")
          .update(payload)
          .eq("id", currentId)
          .select()
          .single();
      } else {
        result = await supabase.from("sops").insert(payload).select().single();
      }

      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: (data) => {
      if (data) {
        setCurrentId(data.id);
        const newUrl = `${window.location.origin}${window.location.pathname}?id=${data.id}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
      }
      queryClient.invalidateQueries({ queryKey: ["userSops"] });
      queryClient.invalidateQueries({ queryKey: ["allSops"] });
    },
  });

  // Mutation: Delete SOP
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sops").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      if (currentId === id) {
        setCurrentId(null);
        setActivities([]);
        setRoles(INITIAL_ROLES);
        setHeader(DEFAULT_HEADER);
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
            setHeader(data.header);
            setActivities(data.activities);
            setRoles(data.roles);
            setCurrentId(data.id);
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
          if (parsed.header) setHeader(parsed.header);
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

  // Auto-save to Cloud (Debounced)
  useEffect(() => {
    if (!isHydrated || !userId || !currentId) return;

    const timer = setTimeout(() => {
      saveMutation.mutate();
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [header, activities, roles, isHydrated, userId, currentId]);

  useEffect(() => {
    setIsSyncing(saveMutation.isPending || deleteMutation.isPending);
  }, [saveMutation.isPending, deleteMutation.isPending]);

  const saveToCloud = useCallback(async () => {
    if (!isHydrated) return;
    try {
      const result = await saveMutation.mutateAsync();
      return { success: true, message: "SOP berhasil disimpan ke Cloud!" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan.";
      return { success: false, message: msg };
    }
  }, [isHydrated, saveMutation]);

  const loadSop = useCallback(
    async (id: string) => {
      setIsSyncing(true);
      try {
        const data = await fetchSopById(id);
        if (data) {
          setHeader(data.header);
          setActivities(data.activities);
          setRoles(data.roles);
          setCurrentId(data.id);
          const newUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;
          window.history.pushState({ path: newUrl }, "", newUrl);
          return { success: true };
        }
        return { success: false, message: "Gagal memuat SOP." };
      } catch {
        return { success: false, message: "Terjadi kesalahan." };
      } finally {
        setIsSyncing(false);
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

  const resetData = () => {
    setActivities([]);
    setRoles(INITIAL_ROLES);
    setHeader(DEFAULT_HEADER);
    setCurrentId(null);
    localStorage.removeItem("sop-builder-data");
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.pushState({ path: cleanUrl }, "", cleanUrl);
  };

  const fetchAllSops = useCallback(() => {
    refetchAllSops();
  }, [refetchAllSops]);

  const validateCurrent = useCallback(() => {
    return validateSOPData({ header, activities, roles });
  }, [header, activities, roles]);

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
    validateCurrent,
  };
}
