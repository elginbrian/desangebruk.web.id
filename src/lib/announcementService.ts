import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, where, serverTimestamp, QueryDocumentSnapshot, DocumentData, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  priority: "normal" | "penting" | "urgent";
  status: "active" | "inactive" | "expired";
  authorId: string;
  authorName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  slug: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  priority: "normal" | "penting" | "urgent";
  authorId: string;
  authorName: string;
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  priority?: "normal" | "penting" | "urgent";
  status?: "active" | "inactive" | "expired";
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 100);
};

const determineStatus = (startDate: string, endDate: string): "active" | "inactive" | "expired" => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return "inactive";
  } else if (now > end) {
    return "expired";
  } else {
    return "active";
  }
};

export const createAnnouncement = async (data: CreateAnnouncementData): Promise<Announcement> => {
  try {
    const slug = generateSlug(data.title);
    const status = determineStatus(data.startDate, data.endDate);

    const announcementData = {
      ...data,
      slug,
      status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "announcements"), announcementData);

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("Failed to create announcement");
    }

    return {
      id: docRef.id,
      ...docSnap.data(),
    } as Announcement;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};

export const getAnnouncements = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  statusFilter?: "all" | "active" | "inactive" | "expired"
): Promise<{ announcements: Announcement[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let q;

    if (statusFilter && statusFilter !== "all") {
      if (lastDoc) {
        q = query(collection(db, "announcements"), where("status", "==", statusFilter), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize));
      } else {
        q = query(collection(db, "announcements"), where("status", "==", statusFilter), orderBy("createdAt", "desc"), limit(pageSize));
      }
    } else {
      if (lastDoc) {
        q = query(collection(db, "announcements"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize));
      } else {
        q = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(pageSize));
      }
    }

    const querySnapshot = await getDocs(q);
    const announcements: Announcement[] = [];
    let lastVisible: QueryDocumentSnapshot<DocumentData> | null = null;

    querySnapshot.forEach((doc) => {
      announcements.push({
        id: doc.id,
        ...doc.data(),
      } as Announcement);
    });

    if (querySnapshot.docs.length > 0) {
      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    }

    return { announcements, lastVisible };
  } catch (error) {
    console.error("Error getting announcements:", error);

    try {
      const fallbackQuery = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(pageSize));
      const fallbackSnapshot = await getDocs(fallbackQuery);
      const announcements: Announcement[] = [];

      fallbackSnapshot.forEach((doc) => {
        const data = doc.data() as Announcement;
        if (!statusFilter || statusFilter === "all" || data.status === statusFilter) {
          announcements.push({
            ...data,
            id: doc.id,
          });
        }
      });

      const filteredAnnouncements = statusFilter && statusFilter !== "all" ? announcements.filter((announcement) => announcement.status === statusFilter) : announcements;

      return {
        announcements: filteredAnnouncements.slice(0, pageSize),
        lastVisible: fallbackSnapshot.docs[fallbackSnapshot.docs.length - 1] || null,
      };
    } catch (fallbackError) {
      console.error("Fallback query also failed:", fallbackError);
      throw new Error("Gagal memuat pengumuman. Silakan coba lagi.");
    }
  }
};

export const getAnnouncementById = async (id: string): Promise<Announcement | null> => {
  try {
    const docRef = doc(db, "announcements", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Announcement;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting announcement:", error);
    throw error;
  }
};

export const getAnnouncementBySlug = async (slug: string): Promise<Announcement | null> => {
  try {
    const q = query(collection(db, "announcements"), where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Announcement;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting announcement by slug:", error);
    throw error;
  }
};

export const updateAnnouncement = async (id: string, data: UpdateAnnouncementData): Promise<Announcement> => {
  try {
    const docRef = doc(db, "announcements", id);

    let updateData: any = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    if (data.title) {
      updateData.slug = generateSlug(data.title);
    }

    if (data.startDate && data.endDate) {
      updateData.status = determineStatus(data.startDate, data.endDate);
    } else if (data.startDate || data.endDate) {
      const currentDoc = await getDoc(docRef);
      if (currentDoc.exists()) {
        const currentData = currentDoc.data();
        const startDate = data.startDate || currentData.startDate;
        const endDate = data.endDate || currentData.endDate;
        updateData.status = determineStatus(startDate, endDate);
      }
    }

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);
    if (!updatedDoc.exists()) {
      throw new Error("Failed to update announcement");
    }

    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as Announcement;
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "announcements", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
};

export const getActiveAnnouncements = async (limitCount: number = 10): Promise<Announcement[]> => {
  try {
    const q = query(collection(db, "announcements"), limit(100));

    const querySnapshot = await getDocs(q);
    const allAnnouncements: Announcement[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allAnnouncements.push({
        id: doc.id,
        ...data,
      } as Announcement);
    });

    const now = new Date();
    const activeAnnouncements = allAnnouncements.filter((announcement) => {
      try {
        const startDate = new Date(announcement.startDate);
        const endDate = new Date(announcement.endDate);

        const isWithinPeriod = now >= startDate && now <= endDate;

        const hasActiveStatus = announcement.status === "active";

        return isWithinPeriod || hasActiveStatus;
      } catch (dateError) {
        return announcement.status === "active";
      }
    });

    const priorityOrder = { urgent: 3, penting: 2, normal: 1 };
    activeAnnouncements.sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 1;
      const priorityB = priorityOrder[b.priority] || 1;

      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }

      try {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt as any);
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt as any);
        return dateB.getTime() - dateA.getTime();
      } catch (dateError) {
        return 0;
      }
    });

    return activeAnnouncements.slice(0, limitCount);
  } catch (error) {
    return [];
  }
};

export const searchAnnouncements = async (searchTerm: string): Promise<Announcement[]> => {
  try {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const announcements: Announcement[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.title.toLowerCase().includes(searchTerm.toLowerCase()) || data.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        announcements.push({
          ...data,
          id: doc.id,
        } as Announcement);
      }
    });

    return announcements;
  } catch (error) {
    console.error("Error searching announcements:", error);

    try {
      const fallbackQuery = query(collection(db, "announcements"));
      const fallbackSnapshot = await getDocs(fallbackQuery);
      const announcements: Announcement[] = [];

      fallbackSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.title.toLowerCase().includes(searchTerm.toLowerCase()) || data.content.toLowerCase().includes(searchTerm.toLowerCase())) {
          announcements.push({
            ...data,
            id: doc.id,
          } as Announcement);
        }
      });

      announcements.sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt as any);
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt as any);
        return dateB.getTime() - dateA.getTime();
      });

      return announcements;
    } catch (fallbackError) {
      console.error("Fallback search failed:", fallbackError);
      throw new Error("Gagal mencari pengumuman. Silakan coba lagi.");
    }
  }
};

export const getAnnouncementsWithPagination = async (
  page: number = 1,
  pageSize: number = 10,
  statusFilter: "all" | "active" | "inactive" | "expired" = "all"
): Promise<{ announcements: Announcement[]; totalPages: number; totalItems: number }> => {
  try {
    const offset = (page - 1) * pageSize;

    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const totalSnapshot = await getDocs(q);

    const allAnnouncements: Announcement[] = [];
    totalSnapshot.forEach((doc) => {
      const data = doc.data();
      allAnnouncements.push({
        id: doc.id,
        ...data,
      } as Announcement);
    });

    let filteredAnnouncements = allAnnouncements;
    if (statusFilter !== "all") {
      filteredAnnouncements = allAnnouncements.filter((announcement) => announcement.status === statusFilter);
    }

    const totalItems = filteredAnnouncements.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedAnnouncements = filteredAnnouncements.slice(offset, offset + pageSize);

    return {
      announcements: paginatedAnnouncements,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching announcements with pagination:", error);
    throw new Error("Gagal memuat pengumuman");
  }
};

export const getAnnouncementCountByStatus = async (statusFilter: "all" | "active" | "inactive" | "expired" = "all"): Promise<number> => {
  try {
    const q = query(collection(db, "announcements"));
    const snapshot = await getDocs(q);

    if (statusFilter === "all") {
      return snapshot.size;
    }

    let count = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === statusFilter) {
        count++;
      }
    });

    return count;
  } catch (error) {
    console.error("Error counting announcements:", error);
    return 0;
  }
};

