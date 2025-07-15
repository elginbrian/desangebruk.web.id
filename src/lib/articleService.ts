import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where, limit as firestoreLimit, startAfter, Timestamp, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { db } from "./firebase";
import { canUploadFile } from "./storageService";

const storage = getStorage();

let storageRefreshCallback: (() => void) | null = null;

export const setStorageRefreshCallback = (callback: () => void) => {
  storageRefreshCallback = callback;
};

const refreshStorageStats = () => {
  if (storageRefreshCallback) {
    storageRefreshCallback();
  }
};

export interface Article {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  imagePath?: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "draft" | "published";
  slug: string;
  excerpt?: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  image?: File;
  authorId: string;
  authorName: string;
  status: "draft" | "published";
}

export interface UpdateArticleData {
  title?: string;
  content?: string;
  image?: File;
  status?: "draft" | "published";
}

const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const createExcerpt = (content: string, maxLength: number = 150): string => {
  const textContent = content.replace(/<[^>]*>/g, "");
  return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent;
};

export const uploadArticleImage = async (file: File, articleId?: string): Promise<{ url: string; path: string }> => {
  try {
    const storageCheck = await canUploadFile(file.size);
    if (!storageCheck.canUpload) {
      throw new Error(storageCheck.message || "Storage penuh!");
    }

    const fileName = `${Date.now()}_${file.name}`;
    const imagePath = `articles/${articleId || "temp"}/${fileName}`;
    const imageRef = ref(storage, imagePath);

    const snapshot = await uploadBytes(imageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    refreshStorageStats();

    return { url, path: imagePath };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error instanceof Error ? error : new Error("Failed to upload image");
  }
};

export const deleteArticleImage = async (imagePath: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);

    refreshStorageStats();
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export const createArticle = async (data: CreateArticleData): Promise<Article> => {
  try {
    const slug = createSlug(data.title);
    const excerpt = createExcerpt(data.content);
    const now = Timestamp.now();

    const articleData = {
      title: data.title,
      content: data.content,
      slug,
      excerpt,
      authorId: data.authorId,
      authorName: data.authorName,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, "articles"), articleData);

    let imageUrl = "";
    let imagePath = "";

    if (data.image) {
      const uploadResult = await uploadArticleImage(data.image, docRef.id);
      imageUrl = uploadResult.url;
      imagePath = uploadResult.path;

      await updateDoc(docRef, {
        imageUrl,
        imagePath,
      });
    }

    return {
      id: docRef.id,
      imageUrl,
      imagePath,
      ...articleData,
    };
  } catch (error) {
    console.error("Error creating article:", error);
    throw new Error("Failed to create article");
  }
};

export const getArticles = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  statusFilter?: "all" | "published" | "draft"
): Promise<{ articles: Article[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let q;

    if (statusFilter && statusFilter !== "all") {
      if (lastDoc) {
        q = query(collection(db, "articles"), where("status", "==", statusFilter), orderBy("createdAt", "desc"), startAfter(lastDoc), firestoreLimit(pageSize));
      } else {
        q = query(collection(db, "articles"), where("status", "==", statusFilter), orderBy("createdAt", "desc"), firestoreLimit(pageSize));
      }
    } else {
      if (lastDoc) {
        q = query(collection(db, "articles"), orderBy("createdAt", "desc"), startAfter(lastDoc), firestoreLimit(pageSize));
      } else {
        q = query(collection(db, "articles"), orderBy("createdAt", "desc"), firestoreLimit(pageSize));
      }
    }

    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data(),
      } as Article);
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    return { articles, lastVisible };
  } catch (error) {
    console.error("Error getting articles:", error);

    try {
      const fallbackQuery = query(collection(db, "articles"), orderBy("createdAt", "desc"), firestoreLimit(pageSize));
      const fallbackSnapshot = await getDocs(fallbackQuery);
      const articles: Article[] = [];

      fallbackSnapshot.forEach((doc) => {
        const data = doc.data() as Article;
        if (!statusFilter || statusFilter === "all" || data.status === statusFilter) {
          articles.push({
            id: doc.id,
            ...data,
          });
        }
      });

      const filteredArticles = statusFilter && statusFilter !== "all" ? articles.filter((article) => article.status === statusFilter) : articles;

      return {
        articles: filteredArticles.slice(0, pageSize),
        lastVisible: fallbackSnapshot.docs[fallbackSnapshot.docs.length - 1] || null,
      };
    } catch (fallbackError) {
      console.error("Fallback query also failed:", fallbackError);
      throw new Error("Gagal memuat artikel. Silakan coba lagi.");
    }
  }
};

export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Article;
    }

    return null;
  } catch (error) {
    console.error("Error getting article:", error);
    throw new Error("Failed to get article");
  }
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    const q = query(collection(db, "articles"), where("slug", "==", slug), firestoreLimit(1));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Article;
    }

    return null;
  } catch (error) {
    console.error("Error getting article by slug:", error);
    throw new Error("Failed to get article");
  }
};

export const updateArticle = async (id: string, data: UpdateArticleData): Promise<Article> => {
  try {
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Article not found");
    }

    const currentData = docSnap.data() as Article;
    const updateData: any = {
      updatedAt: Timestamp.now(),
    };

    if (data.title && data.title !== currentData.title) {
      updateData.title = data.title;
      updateData.slug = createSlug(data.title);
    }

    if (data.content && data.content !== currentData.content) {
      updateData.content = data.content;
      updateData.excerpt = createExcerpt(data.content);
    }

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.image) {
      if (currentData.imagePath) {
        await deleteArticleImage(currentData.imagePath);
      }

      const uploadResult = await uploadArticleImage(data.image, id);
      updateData.imageUrl = uploadResult.url;
      updateData.imagePath = uploadResult.path;
    }

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as Article;
  } catch (error) {
    console.error("Error updating article:", error);
    throw new Error("Failed to update article");
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Article not found");
    }

    const articleData = docSnap.data() as Article;

    if (articleData.imagePath) {
      await deleteArticleImage(articleData.imagePath);
    }

    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting article:", error);
    throw new Error("Failed to delete article");
  }
};

export const searchArticles = async (searchTerm: string): Promise<Article[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      const articleData = doc.data() as Article;
      const article = {
        id: doc.id,
        ...articleData,
      };

      if (article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.content.toLowerCase().includes(searchTerm.toLowerCase()) || (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))) {
        articles.push(article);
      }
    });

    return articles;
  } catch (error) {
    console.error("Error searching articles:", error);

    try {
      const fallbackQuery = query(collection(db, "articles"));
      const fallbackSnapshot = await getDocs(fallbackQuery);
      const articles: Article[] = [];

      fallbackSnapshot.forEach((doc) => {
        const articleData = doc.data() as Article;
        const article = {
          id: doc.id,
          ...articleData,
        };

        if (article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.content.toLowerCase().includes(searchTerm.toLowerCase()) || (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))) {
          articles.push(article);
        }
      });

      articles.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
        return dateB.getTime() - dateA.getTime();
      });

      return articles;
    } catch (fallbackError) {
      console.error("Fallback search failed:", fallbackError);
      throw new Error("Gagal mencari artikel. Silakan coba lagi.");
    }
  }
};

export const getPublishedArticles = async (limit?: number): Promise<Article[]> => {
  try {
    let q;
    if (limit) {
      q = query(collection(db, "articles"), where("status", "==", "published"), orderBy("createdAt", "desc"), firestoreLimit(limit));
    } else {
      q = query(collection(db, "articles"), where("status", "==", "published"), orderBy("createdAt", "desc"));
    }

    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        ...data,
      } as Article);
    });

    return articles;
  } catch (error) {
    try {
      const simpleQuery = query(collection(db, "articles"), where("status", "==", "published"));
      const querySnapshot = await getDocs(simpleQuery);
      const articles: Article[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        articles.push({
          id: doc.id,
          ...data,
        } as Article);
      });

      articles.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
        return dateB.getTime() - dateA.getTime();
      });

      const limitedArticles = limit ? articles.slice(0, limit) : articles;

      return limitedArticles;
    } catch (fallbackError) {
      return [];
    }
  }
};

export const getArticlesWithPagination = async (page: number = 1, pageSize: number = 10, statusFilter: "all" | "published" | "draft" = "all"): Promise<{ articles: Article[]; totalPages: number; totalItems: number }> => {
  try {
    const offset = (page - 1) * pageSize;

    let q;
    if (statusFilter === "all") {
      q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
    } else {
      q = query(collection(db, "articles"), where("status", "==", statusFilter), orderBy("createdAt", "desc"));
    }

    const totalSnapshot = await getDocs(q);
    const totalItems = totalSnapshot.size;
    const totalPages = Math.ceil(totalItems / pageSize);

    const articles: Article[] = [];
    totalSnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        ...data,
      } as Article);
    });

    const paginatedArticles = articles.slice(offset, offset + pageSize);

    return {
      articles: paginatedArticles,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching articles with pagination:", error);
    throw new Error("Gagal memuat artikel");
  }
};

export const getArticleCountByStatus = async (statusFilter: "all" | "published" | "draft" = "all"): Promise<number> => {
  try {
    let q;
    if (statusFilter === "all") {
      q = query(collection(db, "articles"));
    } else {
      q = query(collection(db, "articles"), where("status", "==", statusFilter));
    }

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error counting articles:", error);
    return 0;
  }
};

