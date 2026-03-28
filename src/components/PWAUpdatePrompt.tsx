import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const PWAUpdatePrompt = () => {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      // Check for updates every 60 seconds
      if (r) {
        setInterval(() => r.update(), 60 * 1000);
      }
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="flex items-center gap-3 rounded-xl border bg-card px-5 py-3 shadow-lg">
        <RefreshCw className="h-5 w-5 text-primary animate-spin" />
        <span className="text-sm font-medium text-foreground">
          A new update is available!
        </span>
        <Button
          size="sm"
          onClick={() => updateServiceWorker(true)}
          className="ml-1"
        >
          Update now
        </Button>
      </div>
    </div>
  );
};
