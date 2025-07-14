"use client";

import { useEffect } from "react";

// Hook untuk tracking visitor di setiap halaman
export const usePageVisitor = (pageName?: string) => {
  useEffect(() => {
    const trackPageVisit = async () => {
      try {
        // Import dinamis untuk menghindari SSR issues
        const { updateVisitorStats } = await import("@/lib/visitorService");
        
        // Track page visit
        await updateVisitorStats();
        
        // Optional: Track specific page if needed
        if (pageName) {
          console.log(`Page visited: ${pageName}`);
        }
      } catch (error) {
        console.error("Error tracking page visit:", error);
      }
    };

    // Delay tracking untuk memastikan komponen sudah mounted
    const timer = setTimeout(trackPageVisit, 1000);
    
    return () => clearTimeout(timer);
  }, [pageName]);
};

export default usePageVisitor;
