"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, getUserProfile, UserProfile } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "User logged out");
      
      setUser(user);

      if (user) {
        try {
          // Get user profile when user is authenticated
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setProfile(userProfile);
            console.log("User profile loaded:", userProfile);
          } else {
            // Create profile if doesn't exist
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || "",
              name: user.displayName || "Admin",
              role: "admin",
              createdAt: new Date(),
            };
            setProfile(newProfile);
            console.log("Created new profile for user:", newProfile);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          // Set basic profile from auth user if profile loading fails
          const fallbackProfile: UserProfile = {
            uid: user.uid,
            email: user.email || "",
            name: user.displayName || "Admin", 
            role: "admin",
            createdAt: new Date(),
          };
          setProfile(fallbackProfile);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user && !!profile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
