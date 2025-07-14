"use client";

import { useEffect } from "react";

export const usePageVisitor = (pageName?: string) => {
  useEffect(() => {
    const trackPageVisit = async () => {
      try {
        const { updateVisitorStats } = await import("@/lib/visitorService");
        
        await updateVisitorStats();
        
        if (pageName) {
          console.log(`Page visited: ${pageName}`);
        }
      } catch (error) {
        console.error("Error tracking page visit:", error);
      }
    };

    const timer = setTimeout(trackPageVisit, 1000);
    
    return () => clearTimeout(timer);
  }, [pageName]);
};

export default usePageVisitor;

