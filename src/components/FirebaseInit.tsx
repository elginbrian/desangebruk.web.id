"use client";

import { useEffect } from "react";
import { app, analytics } from "@/lib/firebase";

const FirebaseInit = () => {
  useEffect(() => {
    // Firebase is automatically initialized when imported
    // Analytics is initialized in the firebase.ts file for browser environment
    console.log("Firebase initialized");
  }, []);

  return null; // This component doesn't render anything
};

export default FirebaseInit;
