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

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 100);
};

// Determine status based on dates
const determineStatus = (startDate: string, endDate: string): "active" | "inactive" | "expired" => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return "inactive"; // Not started yet
  } else if (now > end) {
    return "expired"; // Already ended
  } else {
    return "active"; // Currently active
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

    // Get the created document
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
    let q = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(pageSize));

    // Add status filter if specified
    if (statusFilter && statusFilter !== "all") {
      q = query(collection(db, "announcements"), where("status", "==", statusFilter), orderBy("createdAt", "desc"), limit(pageSize));
    }

    // Add pagination if lastDoc is provided
    if (lastDoc) {
      q = query(collection(db, "announcements"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize));

      if (statusFilter && statusFilter !== "all") {
        q = query(collection(db, "announcements"), where("status", "==", statusFilter), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize));
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
    throw error;
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

    // Generate new slug if title is being updated
    let updateData: any = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    if (data.title) {
      updateData.slug = generateSlug(data.title);
    }

    // Update status if dates are being updated
    if (data.startDate && data.endDate) {
      updateData.status = determineStatus(data.startDate, data.endDate);
    } else if (data.startDate || data.endDate) {
      // Get current announcement to check existing dates
      const currentDoc = await getDoc(docRef);
      if (currentDoc.exists()) {
        const currentData = currentDoc.data();
        const startDate = data.startDate || currentData.startDate;
        const endDate = data.endDate || currentData.endDate;
        updateData.status = determineStatus(startDate, endDate);
      }
    }

    await updateDoc(docRef, updateData);

    // Get the updated document
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

// Get active announcements for public display
export const getActiveAnnouncements = async (limitCount: number = 10): Promise<Announcement[]> => {
  try {
    // Use the simplest possible query to avoid any index issues
    const q = query(
      collection(db, "announcements"),
      limit(100) // Get more documents to filter locally
    );

    const querySnapshot = await getDocs(q);
    const allAnnouncements: Announcement[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allAnnouncements.push({
        id: doc.id,
        ...data,
      } as Announcement);
    });

    // Filter for active announcements in memory
    const now = new Date();
    const activeAnnouncements = allAnnouncements.filter((announcement) => {
      // Check if the announcement is active based on dates
      try {
        const startDate = new Date(announcement.startDate);
        const endDate = new Date(announcement.endDate);

        // Check if current time is within the announcement period
        const isWithinPeriod = now >= startDate && now <= endDate;

        // Also check the status field
        const hasActiveStatus = announcement.status === "active";

        return isWithinPeriod || hasActiveStatus;
      } catch (dateError) {
        // If there's an error with dates, check status only
        return announcement.status === "active";
      }
    });

    // Sort by priority in memory (urgent > penting > normal)
    const priorityOrder = { urgent: 3, penting: 2, normal: 1 };
    activeAnnouncements.sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 1;
      const priorityB = priorityOrder[b.priority] || 1;

      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }

      // If same priority, sort by creation date (newer first)
      try {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt as any);
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt as any);
        return dateB.getTime() - dateA.getTime();
      } catch (dateError) {
        return 0; // Keep original order if date comparison fails
      }
    });

    return activeAnnouncements.slice(0, limitCount);
  } catch (error) {
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

// Search announcements
export const searchAnnouncements = async (searchTerm: string): Promise<Announcement[]> => {
  try {
    // For better search functionality, you might want to implement full-text search
    // with external services like Algolia or use Firestore's limited text search
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const announcements: Announcement[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Simple text search - case insensitive
      if (data.title.toLowerCase().includes(searchTerm.toLowerCase()) || data.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        announcements.push({
          id: doc.id,
          ...data,
        } as Announcement);
      }
    });

    return announcements;
  } catch (error) {
    console.error("Error searching announcements:", error);
    throw error;
  }
};
