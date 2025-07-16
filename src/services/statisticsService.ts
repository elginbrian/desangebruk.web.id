import { collection, getCountFromServer, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const fetchArticleStats = async () => {
  const totalQuery = query(collection(db, "articles"));
  const totalSnapshot = await getCountFromServer(totalQuery);
  const totalCount = totalSnapshot.data().count;

  const publishedQuery = query(collection(db, "articles"), where("status", "==", "published"));
  const publishedSnapshot = await getCountFromServer(publishedQuery);
  const publishedCount = publishedSnapshot.data().count;

  const draftQuery = query(collection(db, "articles"), where("status", "==", "draft"));
  const draftSnapshot = await getCountFromServer(draftQuery);
  const draftCount = draftSnapshot.data().count;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyQuery = query(collection(db, "articles"), where("createdAt", ">=", Timestamp.fromDate(startOfMonth)));
  const monthlySnapshot = await getCountFromServer(monthlyQuery);
  const monthlyCount = monthlySnapshot.data().count;

  return {
    totalArticles: totalCount,
    totalPublished: publishedCount,
    totalDraft: draftCount,
    monthlyChange: monthlyCount,
  };
};

export const fetchAnnouncementStats = async () => {
  const totalQuery = query(collection(db, "announcements"));
  const totalSnapshot = await getCountFromServer(totalQuery);
  const totalCount = totalSnapshot.data().count;

  const now = new Date();
  const activeQuery = query(collection(db, "announcements"), where("startDate", "<=", now.toISOString().split("T")[0]), where("endDate", ">=", now.toISOString().split("T")[0]));
  const activeSnapshot = await getCountFromServer(activeQuery);
  const activeCount = activeSnapshot.data().count;

  const expiredQuery = query(collection(db, "announcements"), where("endDate", "<", now.toISOString().split("T")[0]));
  const expiredSnapshot = await getCountFromServer(expiredQuery);
  const expiredCount = expiredSnapshot.data().count;

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyQuery = query(collection(db, "announcements"), where("createdAt", ">=", Timestamp.fromDate(startOfMonth)));
  const monthlySnapshot = await getCountFromServer(monthlyQuery);
  const monthlyCount = monthlySnapshot.data().count;

  return {
    totalAnnouncements: totalCount,
    activeAnnouncements: activeCount,
    expiredAnnouncements: expiredCount,
    monthlyChange: monthlyCount,
  };
};

export const fetchVisitorStats = async () => {
  const totalQuery = query(collection(db, "visitors"));
  const totalSnapshot = await getCountFromServer(totalQuery);
  const totalCount = totalSnapshot.data().count;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayQuery = query(collection(db, "visitors"), where("lastVisit", ">=", Timestamp.fromDate(startOfToday)));
  const todaySnapshot = await getCountFromServer(todayQuery);
  const todayCount = todaySnapshot.data().count;

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyQuery = query(collection(db, "visitors"), where("lastVisit", ">=", Timestamp.fromDate(startOfMonth)));
  const monthlySnapshot = await getCountFromServer(monthlyQuery);
  const monthlyCount = monthlySnapshot.data().count;

  return {
    totalVisitors: totalCount,
    todayVisitors: todayCount,
    monthlyVisitors: monthlyCount,
  };
};
