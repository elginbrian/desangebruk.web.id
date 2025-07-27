import { doc, getDoc, setDoc, updateDoc, increment, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface VisitorStats {
  totalVisitors: number;
  dailyVisits: Record<string, number>;
  lastUpdated: Timestamp;
  uniqueVisitors: number;
  pageViews: number;
}

const VISITOR_STATS_DOC = "stats";
const VISITOR_COLLECTION = "visitors";

const getConsistentDate = (): string => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

const isStorageAvailable = (type: "localStorage" | "sessionStorage"): boolean => {
  try {
    if (typeof window === "undefined") return false;
    const storage = window[type];
    const test = "__storage_test__";
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export const getVisitorStats = async (): Promise<VisitorStats | null> => {
  try {
    const docRef = doc(db, VISITOR_COLLECTION, VISITOR_STATS_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as VisitorStats;

      if (!data.dailyVisits) {
        data.dailyVisits = {};
      }

      return data;
    } else {
      const today = new Date();
      const initialDailyVisits: Record<string, number> = {};

      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        initialDailyVisits[dateStr] = 0;
      }

      const defaultStats: VisitorStats = {
        totalVisitors: 0,
        dailyVisits: initialDailyVisits,
        lastUpdated: Timestamp.now(),
        uniqueVisitors: 0,
        pageViews: 0,
      };

      await setDoc(docRef, defaultStats);
      return defaultStats;
    }
  } catch (error) {
    console.error("Error getting visitor stats:", error);
    return null;
  }
};

export const updateVisitorStats = async (): Promise<void> => {
  try {
    if (typeof window === "undefined") {
      return;
    }

    const docRef = doc(db, VISITOR_COLLECTION, VISITOR_STATS_DOC);
    const today = getConsistentDate();

    const hasLocalStorage = isStorageAvailable("localStorage");
    const hasSessionStorage = isStorageAvailable("sessionStorage");

    let lastVisitDate = "";
    let sessionVisitDate = "";
    let lastFingerprint = "";

    if (hasLocalStorage) {
      lastVisitDate = localStorage.getItem("lastVisitDate") || "";
      lastFingerprint = localStorage.getItem("userFingerprint") || "";
    }

    if (hasSessionStorage) {
      sessionVisitDate = sessionStorage.getItem("sessionVisitDate") || "";
    }

    const userFingerprint = generateUserFingerprint();

    const isNewVisitor = lastVisitDate !== today || sessionVisitDate !== today || (lastFingerprint && lastFingerprint !== userFingerprint);

    if (isNewVisitor) {
      await updateDoc(docRef, {
        totalVisitors: increment(1),
        [`dailyVisits.${today}`]: increment(1),
        lastUpdated: Timestamp.now(),
        uniqueVisitors: increment(1),
      });

      if (hasLocalStorage) {
        localStorage.setItem("lastVisitDate", today);
        localStorage.setItem("userFingerprint", userFingerprint);
      }

      if (hasSessionStorage) {
        sessionStorage.setItem("sessionVisitDate", today);
      }
    }

    await updateDoc(docRef, {
      pageViews: increment(1),
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating visitor stats:", error);
  }
};

const generateUserFingerprint = (): string => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return navigator.userAgent.slice(0, 10) + Date.now().toString(36);
    }

    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillText("Browser fingerprint", 2, 2);

    const fingerprint = [navigator.userAgent, navigator.language, screen.width + "x" + screen.height, new Date().getTimezoneOffset().toString(), canvas.toDataURL()].join("|");

    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return Math.abs(hash).toString(36);
  } catch (error) {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};

export const cleanupOldVisitorData = async (): Promise<void> => {
  try {
    const stats = await getVisitorStats();
    if (!stats) return;

    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const updatedDailyVisits: Record<string, number> = {};

    Object.entries(stats.dailyVisits).forEach(([date, count]) => {
      if (new Date(date) >= oneYearAgo) {
        updatedDailyVisits[date] = count;
      }
    });

    if (Object.keys(updatedDailyVisits).length !== Object.keys(stats.dailyVisits).length) {
      const docRef = doc(db, VISITOR_COLLECTION, VISITOR_STATS_DOC);
      await updateDoc(docRef, {
        dailyVisits: updatedDailyVisits,
        lastUpdated: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error cleaning up visitor data:", error);
  }
};

export const getTodayVisitorCount = (stats: VisitorStats): number => {
  const today = getConsistentDate();
  return stats.dailyVisits[today] || 0;
};

export const getWeeklyVisitorCount = (stats: VisitorStats): number => {
  const today = new Date();
  let weeklyCount = 0;

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    weeklyCount += stats.dailyVisits[dateStr] || 0;
  }

  return weeklyCount;
};

export const ensureHistoricalData = async (days: number = 30): Promise<void> => {
  try {
    const stats = await getVisitorStats();
    if (!stats) return;

    const today = new Date();
    const updatedDailyVisits = { ...stats.dailyVisits };
    let hasNewData = false;

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      if (!(dateStr in updatedDailyVisits)) {
        updatedDailyVisits[dateStr] = 0;
        hasNewData = true;
      }
    }

    if (hasNewData) {
      const docRef = doc(db, VISITOR_COLLECTION, VISITOR_STATS_DOC);
      await updateDoc(docRef, {
        dailyVisits: updatedDailyVisits,
        lastUpdated: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error ensuring historical data:", error);
  }
};

export const getVisitorDataByRange = (stats: VisitorStats, days: number): { labels: string[]; data: number[] } => {
  const today = new Date();
  const labels: string[] = [];
  const data: number[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayName = date.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    labels.push(dayName);
    data.push(stats.dailyVisits[dateStr] || 0);
  }

  return { labels, data };
};

