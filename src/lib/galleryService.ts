import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getDoc,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imagePath: string;
  category?: string;
  isActive: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy: string;
}

export interface CreateGalleryImageData {
  title: string;
  description?: string;
  image: File;
  category?: string;
  isActive: boolean;
  order: number;
  createdBy: string;
}

export interface UpdateGalleryImageData {
  title?: string;
  description?: string;
  image?: File;
  category?: string;
  isActive?: boolean;
  order?: number;
  updatedBy: string;
}

export const uploadGalleryImage = async (file: File, imageId?: string): Promise<{ url: string; path: string }> => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const imagePath = `gallery/${imageId || "temp"}_${fileName}`;
    const imageRef = ref(storage, imagePath);

    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: imagePath,
    };
  } catch (error) {
    console.error("Error uploading gallery image:", error);
    throw new Error("Failed to upload image");
  }
};

export const deleteGalleryImage = async (imagePath: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    throw new Error("Failed to delete image");
  }
};

export const createGalleryImage = async (data: CreateGalleryImageData): Promise<GalleryImage> => {
  try {
    const now = Timestamp.now();
    
    const docRef = await addDoc(collection(db, "gallery"), {
      title: data.title,
      description: data.description || "",
      imageUrl: "",
      imagePath: "",
      category: data.category || "umum",
      isActive: data.isActive,
      order: data.order,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    });

    const { url, path } = await uploadGalleryImage(data.image, docRef.id);

    await updateDoc(docRef, {
      imageUrl: url,
      imagePath: path,
    });

    const galleryImage: GalleryImage = {
      id: docRef.id,
      title: data.title,
      description: data.description || "",
      imageUrl: url,
      imagePath: path,
      category: data.category || "umum",
      isActive: data.isActive,
      order: data.order,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    };

    return galleryImage;
  } catch (error) {
    console.error("Error creating gallery image:", error);
    throw new Error("Failed to create gallery image");
  }
};

export const getGalleryImages = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  statusFilter?: "all" | "active" | "inactive"
): Promise<{ images: GalleryImage[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let q;

    if (statusFilter && statusFilter !== "all") {
      q = query(
        collection(db, "gallery"),
        where("isActive", "==", statusFilter === "active"),
        orderBy("updatedAt", "desc"),
        limit(pageSize)
      );
    } else {
      q = query(
        collection(db, "gallery"),
        orderBy("updatedAt", "desc"),
        limit(pageSize)
      );
    }

    if (lastDoc) {
      if (statusFilter && statusFilter !== "all") {
        q = query(
          collection(db, "gallery"),
          where("isActive", "==", statusFilter === "active"),
          orderBy("updatedAt", "desc"),
          startAfter(lastDoc),
          limit(pageSize)
        );
      } else {
        q = query(
          collection(db, "gallery"),
          orderBy("updatedAt", "desc"),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }
    }

    const querySnapshot = await getDocs(q);
    const images: GalleryImage[] = [];
    let lastVisible: QueryDocumentSnapshot<DocumentData> | null = null;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      images.push({
        id: doc.id,
        title: data.title,
        description: data.description || "",
        imageUrl: data.imageUrl,
        imagePath: data.imagePath,
        category: data.category || "umum",
        isActive: data.isActive,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy,
        updatedBy: data.updatedBy,
      });
    });

    if (querySnapshot.docs.length > 0) {
      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    }

    return { images, lastVisible };
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return { images: [], lastVisible: null };
  }
};

export const getGalleryImageById = async (id: string): Promise<GalleryImage | null> => {
  try {
    const docRef = doc(db, "gallery", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      imagePath: data.imagePath,
      category: data.category,
      isActive: data.isActive,
      order: data.order,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    };
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    throw new Error("Failed to fetch gallery image");
  }
};

export const updateGalleryImage = async (id: string, data: UpdateGalleryImageData): Promise<GalleryImage> => {
  try {
    const docRef = doc(db, "gallery", id);
    
    const currentDoc = await getDoc(docRef);
    if (!currentDoc.exists()) {
      throw new Error("Gallery image not found");
    }
    
    const currentData = currentDoc.data();
    let updateData: any = {
      updatedAt: Timestamp.now(),
      updatedBy: data.updatedBy,
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.order !== undefined) updateData.order = data.order;

    if (data.image) {
      if (currentData.imagePath) {
        await deleteGalleryImage(currentData.imagePath);
      }

      const { url, path } = await uploadGalleryImage(data.image, id);
      updateData.imageUrl = url;
      updateData.imagePath = path;
    }

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);
    const updatedData = updatedDoc.data()!;

    return {
      id: updatedDoc.id,
      title: updatedData.title,
      description: updatedData.description,
      imageUrl: updatedData.imageUrl,
      imagePath: updatedData.imagePath,
      category: updatedData.category,
      isActive: updatedData.isActive,
      order: updatedData.order,
      createdAt: updatedData.createdAt,
      updatedAt: updatedData.updatedAt,
      createdBy: updatedData.createdBy,
      updatedBy: updatedData.updatedBy,
    };
  } catch (error) {
    console.error("Error updating gallery image:", error);
    throw new Error("Failed to update gallery image");
  }
};

export const deleteGalleryImageById = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "gallery", id);
    
    const currentDoc = await getDoc(docRef);
    if (currentDoc.exists()) {
      const currentData = currentDoc.data();
      if (currentData.imagePath) {
        await deleteGalleryImage(currentData.imagePath);
      }
    }

    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    throw new Error("Failed to delete gallery image");
  }
};

export const getActiveGalleryImages = async (limitCount?: number): Promise<GalleryImage[]> => {
  try {
    console.log("Starting to fetch active gallery images...");
    console.log("Database instance:", db);
    console.log("Collection name: gallery");
    
    const testQuery = query(collection(db, "gallery"));
    const testSnapshot = await getDocs(testQuery);
    console.log("Total documents in gallery collection:", testSnapshot.size);
    
    let q = query(
      collection(db, "gallery"),
      where("isActive", "==", true)
    );

    if (limitCount) {
      q = query(
        collection(db, "gallery"),
        where("isActive", "==", true),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const images: GalleryImage[] = [];

    console.log("Active documents found:", querySnapshot.size);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Document data:", doc.id, {
        title: data.title,
        isActive: data.isActive,
        category: data.category,
        imageUrl: data.imageUrl
      });
      
      images.push({
        id: doc.id,
        title: data.title || "Untitled",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        category: data.category || "umum",
        isActive: data.isActive ?? true,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy || "",
        updatedBy: data.updatedBy || "",
      });
    });

    console.log("Processed images:", images.length, images);

    images.sort((a, b) => {
      if (b.updatedAt && a.updatedAt) {
        return b.updatedAt.toDate().getTime() - a.updatedAt.toDate().getTime();
      }
      return 0;
    });

    return images;
  } catch (error) {
    console.error("Error fetching active gallery images:", error);
    return [];
  }
};

