import { useEffect, useState, useRef } from "react";
import { pb } from "@/lib/pocketbase";

export function useSOPPresence(userId: string | null, currentSopId: string | null) {
  const [lockedSopIds, setLockedSopIds] = useState<string[]>([]);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    // Berlangganan ke realtime updates koleksi sops PocketBase via SSE
    const subscribeRealtime = async () => {
      try {
        await pb.collection("sops").subscribe("*", (e) => {
          if (!isMounted) return;
          if (e.action === "update" && e.record) {
            // Jika ada perubahan realtime pada SOP oleh pengguna lain
            const updatedId = e.record.id;
            if (updatedId && updatedId !== currentSopId) {
              setLockedSopIds((prev) => {
                if (!prev.includes(updatedId)) {
                  return [...prev, updatedId];
                }
                return prev;
              });
              // Lepaskan lock setelah jeda aktif
              setTimeout(() => {
                if (isMounted) {
                  setLockedSopIds((prev) => prev.filter((id) => id !== updatedId));
                }
              }, 4000);
            }
          }
        });
        isSubscribedRef.current = true;
      } catch (err) {
        console.warn("PocketBase realtime presence subscription warning:", err);
      }
    };

    subscribeRealtime();

    return () => {
      isMounted = false;
      if (isSubscribedRef.current) {
        pb.collection("sops").unsubscribe("*").catch(() => {});
        isSubscribedRef.current = false;
      }
    };
  }, [userId, currentSopId]);

  return lockedSopIds;
}
