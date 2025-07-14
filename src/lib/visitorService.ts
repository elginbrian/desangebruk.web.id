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

export const getVisitorStats = async (): Promise<VisitorStats | null> => {
  try {
    const docRef = doc(db, VISITOR_COLLECTION, VISITOR_STATS_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as VisitorStats;
      return data;
    } else {
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

export const updateVisitorStats = async (): Promise<void> => {
  try {
    const docRef = doc(db, VISITOR_COLLECTION, VISITOR_STATS_DOC);
    const today = new Date().toISOString().split("T")[0];

    const lastVisitDate = localStorage.getItem("lastVisitDate");
    const isNewVisitor = lastVisitDate !== today;

    if (isNewVisitor) {
      await updateDoc(docRef, {
        totalVisitors: increment(1),
        [`dailyVisits.${today}`]: increment(1),
        lastUpdated: Timestamp.now(),
        uniqueVisitors: increment(1),
      });

      localStorage.setItem("lastVisitDate", today);
    }

    await updateDoc(docRef, {
      pageViews: increment(1),
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating visitor stats:", error);
  }
};

export const cleanupOldVisitorData = async (): Promise<void> => {
  try {
    const stats = await getVisitorStats();
    if (!stats) return;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const updatedDailyVisits: Record<string, number> = {};

    Object.entries(stats.dailyVisits).forEach(([date, count]) => {
      if (new Date(date) >= thirtyDaysAgo) {
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
  const today = new Date().toISOString().split("T")[0];
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

