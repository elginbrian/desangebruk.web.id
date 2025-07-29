import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, where, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import { canUploadFile } from "./storageService";

let storageRefreshCallback: (() => void) | null = null;

export const setStorageRefreshCallback = (callback: () => void) => {
  storageRefreshCallback = callback;
};

const refreshStorageStats = () => {
  if (storageRefreshCallback) {
    storageRefreshCallback();
  }
};

export interface StructureItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imagePath: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy: string;
}

export interface CreateStructureData {
  name: string;
  description: string;
  image: File;
  order: number;
  isActive: boolean;
  createdBy: string;
}

export interface UpdateStructureData {
  name?: string;
  description?: string;
  image?: File;
  order?: number;
  isActive?: boolean;
  updatedBy: string;
}

const uploadStructureImage = async (file: File, structureId?: string): Promise<{ url: string; path: string }> => {
  try {
    const storageCheck = await canUploadFile(file.size);
    if (!storageCheck.canUpload) {
      throw new Error(storageCheck.message);
    }

    const fileName = structureId ? `${structureId}.${file.name.split(".").pop()}` : `${Date.now()}_${file.name}`;
    const imagePath = `structures/${fileName}`;
    const imageRef = ref(storage, imagePath);

    const uploadResult = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);

    refreshStorageStats();

    return {
      url: downloadURL,
      path: imagePath,
    };
  } catch (error) {
    console.error("Error uploading structure image:", error);
    throw error instanceof Error ? error : new Error("Failed to upload structure image");
  }
};

const deleteStructureImage = async (imagePath: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    refreshStorageStats();
  } catch (error) {
    console.error("Error deleting structure image:", error);
  }
};

export const createStructure = async (data: CreateStructureData): Promise<StructureItem> => {
  try {
    const now = Timestamp.now();

    const docRef = await addDoc(collection(db, "structures"), {
      name: data.name,
      description: data.description,
      imageUrl: "",
      imagePath: "",
      order: data.order,
      isActive: data.isActive,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    });

    const { url, path } = await uploadStructureImage(data.image, docRef.id);

    await updateDoc(docRef, {
      imageUrl: url,
      imagePath: path,
    });

    const structureItem: StructureItem = {
      id: docRef.id,
      name: data.name,
      description: data.description,
      imageUrl: url,
      imagePath: path,
      order: data.order,
      isActive: data.isActive,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    };

    return structureItem;
  } catch (error) {
    console.error("Error creating structure:", error);
    throw new Error("Failed to create structure");
  }
};

export const getStructures = async (): Promise<StructureItem[]> => {
  try {
    const q = query(collection(db, "structures"));
    const querySnapshot = await getDocs(q);

    const structures: StructureItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      structures.push({
        id: doc.id,
        name: data.name || "Untitled",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        order: data.order || 0,
        isActive: data.isActive ?? true,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || "",
        updatedBy: data.updatedBy || "",
      });
    });

    structures.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      const aDate = a.updatedAt && typeof a.updatedAt === "object" && "toDate" in a.updatedAt ? (a.updatedAt as any).toDate() : new Date(a.updatedAt || 0);
      const bDate = b.updatedAt && typeof b.updatedAt === "object" && "toDate" in b.updatedAt ? (b.updatedAt as any).toDate() : new Date(b.updatedAt || 0);
      return bDate.getTime() - aDate.getTime();
    });

    return structures;
  } catch (error) {
    console.error("Error getting structures:", error);
    return [];
  }
};

export const getStructureById = async (id: string): Promise<StructureItem | null> => {
  try {
    const docRef = doc(db, "structures", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || "",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        order: data.order || 0,
        isActive: data.isActive ?? true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || "",
        updatedBy: data.updatedBy || "",
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting structure:", error);
    throw new Error("Failed to get structure");
  }
};

export const updateStructure = async (id: string, data: UpdateStructureData): Promise<StructureItem> => {
  try {
    const docRef = doc(db, "structures", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Structure not found");
    }

    const currentData = docSnap.data() as StructureItem;
    const updateData: any = {
      updatedAt: Timestamp.now(),
      updatedBy: data.updatedBy,
    };

    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (data.image) {
      if (currentData.imagePath) {
        await deleteStructureImage(currentData.imagePath);
      }

      const { url, path } = await uploadStructureImage(data.image, id);
      updateData.imageUrl = url;
      updateData.imagePath = path;
    }

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);
    const updatedData = updatedDoc.data()!;

    return {
      id: updatedDoc.id,
      name: updatedData.name,
      description: updatedData.description,
      imageUrl: updatedData.imageUrl,
      imagePath: updatedData.imagePath,
      order: updatedData.order,
      isActive: updatedData.isActive,
      createdAt: updatedData.createdAt,
      updatedAt: updatedData.updatedAt,
      createdBy: updatedData.createdBy,
      updatedBy: updatedData.updatedBy,
    };
  } catch (error) {
    console.error("Error updating structure:", error);
    throw new Error("Failed to update structure");
  }
};

export const deleteStructure = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "structures", id);

    const currentDoc = await getDoc(docRef);
    if (currentDoc.exists()) {
      const currentData = currentDoc.data();
      if (currentData.imagePath) {
        await deleteStructureImage(currentData.imagePath);
      }
    }

    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting structure:", error);
    throw new Error("Failed to delete structure");
  }
};

export const getActiveStructures = async (): Promise<StructureItem[]> => {
  try {
    const q = query(collection(db, "structures"), where("isActive", "==", true));
    const querySnapshot = await getDocs(q);

    const structures: StructureItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      structures.push({
        id: doc.id,
        name: data.name || "Untitled",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        order: data.order || 0,
        isActive: data.isActive ?? true,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || "",
        updatedBy: data.updatedBy || "",
      });
    });

    structures.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      const aDate = a.updatedAt && typeof a.updatedAt === "object" && "toDate" in a.updatedAt ? (a.updatedAt as any).toDate() : new Date(a.updatedAt || 0);
      const bDate = b.updatedAt && typeof b.updatedAt === "object" && "toDate" in b.updatedAt ? (b.updatedAt as any).toDate() : new Date(b.updatedAt || 0);
      return bDate.getTime() - aDate.getTime();
    });

    return structures;
  } catch (error) {
    console.error("Error getting active structures:", error);
    return [];
  }
};

