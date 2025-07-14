import { doc, getDoc, setDoc, updateDoc, increment, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface VisitorStats {
  totalVisitors: number;
  dailyVisits: Record<string, number>;
  lastUpdated: Timestamp;
  uniqueVisitors: number;
  pageViews: number;
}

// Collection dan document reference
const VISITOR_STATS_DOC = "stats";
const VISITOR_COLLECTION = "visitors";

// Get visitor stats dari Firebase
export const getVisitorStats = async (): Promise<VisitorStats | null> => {
  try {
    const docRef = doc(db, VISITOR_COLLECTION, VISITOR_STATS_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as VisitorStats;
      return data;
    } else {
      // Jika belum ada data, buat document baru dengan data default
      const defaultStats: VisitorStats = {
        totalVisitors: 0,
        dailyVisits: {},
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

// Update visitor stats di Firebase
export const updateVisitorStats = async (): Promise<void> => {
  try {
    const docRef = doc(db, VISITOR_COLLECTION, VISITOR_STATS_DOC);
    const today = new Date().toISOString().split("T")[0];

    // Check if user already visited today (using localStorage for client-side tracking)
    const lastVisitDate = localStorage.getItem("lastVisitDate");
    const isNewVisitor = lastVisitDate !== today;

    if (isNewVisitor) {
      // Update daily visits dan total visitors
      await updateDoc(docRef, {
        totalVisitors: increment(1),
        [`dailyVisits.${today}`]: increment(1),
        lastUpdated: Timestamp.now(),
        uniqueVisitors: increment(1),
      });

      // Simpan ke localStorage
      localStorage.setItem("lastVisitDate", today);
    }

    // Selalu update page views
    await updateDoc(docRef, {
      pageViews: increment(1),
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating visitor stats:", error);
  }
};

// Clean up old daily visit data (keep only last 30 days)
export const cleanupOldVisitorData = async (): Promise<void> => {
  try {
    const stats = await getVisitorStats();
    if (!stats) return;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const updatedDailyVisits: Record<string, number> = {};

    // Keep only data from last 30 days
    Object.entries(stats.dailyVisits).forEach(([date, count]) => {
      if (new Date(date) >= thirtyDaysAgo) {
        updatedDailyVisits[date] = count;
      }
    });

    // Update Firebase if there were changes
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

// Get today's visitor count
export const getTodayVisitorCount = (stats: VisitorStats): number => {
  const today = new Date().toISOString().split("T")[0];
  return stats.dailyVisits[today] || 0;
};

// Get weekly visitor count
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
