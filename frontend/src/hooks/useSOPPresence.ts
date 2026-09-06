import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export function useSOPPresence(userId: string | null, currentSopId: string | null) {
  const [lockedSopIds, setLockedSopIds] = useState<string[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Append a random session string to userId so multiple tabs from the same user have unique keys.
    // If a user opens the same SOP in two tabs, they should lock each other out (to prevent self-overwrite).
    const sessionId = `${userId}-${Math.random().toString(36).substring(7)}`;

    const channel = supabase.channel("sop-presence", {
      config: {
        presence: {
          key: sessionId,
        },
      },
    });

    channelRef.current = channel;

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const lockedIds = new Set<string>();

        for (const [key, presences] of Object.entries(state)) {
          if (key !== sessionId) {
            presences.forEach((presence: Record<string, unknown>) => {
              if (typeof presence.editing_sop_id === "string") {
                lockedIds.add(presence.editing_sop_id);
              }
            });
          }
        }
        
        setLockedSopIds(Array.from(lockedIds));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ editing_sop_id: currentSopId });
        }
      });

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); 

  // Separate effect to track changes when the user switches to a different SOP
  useEffect(() => {
    if (channelRef.current && channelRef.current.state === "joined") {
      channelRef.current.track({ editing_sop_id: currentSopId });
    }
  }, [currentSopId]);

  return lockedSopIds;
}
