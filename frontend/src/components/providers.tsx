import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MaintenanceListener } from "@/components/maintenance-listener";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 30 * 1000, retry: 1 } },
  }));
  return (
    <QueryClientProvider client={queryClient}>
      <MaintenanceListener />
      {children}
    </QueryClientProvider>
  );
}