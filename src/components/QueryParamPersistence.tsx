"use client";

import { useEffect } from "react";

export function QueryParamPersistence() {
  useEffect(() => {
    const params = window.location.search;
    if (params) sessionStorage.setItem("landing_params", params);
    const handleHashChange = () => {
      const stored = sessionStorage.getItem("landing_params");
      if (stored && !window.location.search) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + stored + window.location.hash
        );
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  return null;
}
