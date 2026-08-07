"use client";

import { useEffect } from "react";

interface TrackingConfig {
  siteKey?: string;
  siteId?: string;
  gtmId?: string;
  gaId?: string;
  pixelId?: string;
}

declare global {
  interface Window {
    MEGA_TAG_CONFIG?: Record<string, string | undefined>;
    API_ENDPOINT?: string;
    TRACKING_API_ENDPOINT?: string;
  }
}

export function useTracking(config: TrackingConfig) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Set MegaTag config (redundant Layer 2 — layout.tsx already sets it)
    if (config.siteKey) {
      window.MEGA_TAG_CONFIG = {
        siteKey: config.siteKey,
        siteId: config.siteId,
        gtmId: config.gtmId,
        gaId: config.gaId,
        pixelId: config.pixelId,
      };
    }

    window.API_ENDPOINT = "https://optimizer.gomega.ai";
    window.TRACKING_API_ENDPOINT = "https://events-api.gomega.ai";

    // Optimizer is loaded by layout.tsx; if it didn't load, inject it as fallback
    if (!document.getElementById("optimizer-script")) {
      const script = document.createElement("script");
      script.id = "optimizer-script";
      script.src = "https://cdn.gomega.ai/scripts/optimizer.min.js";
      script.async = true;
      if (config.siteId) script.setAttribute("data-site-id", config.siteId);
      document.head.appendChild(script);
    }
  }, [config]);
}
