import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where, limit as firestoreLimit, startAfter, Timestamp, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { db } from "./firebase";

// Initialize Storage
const storage = getStorage();

export interface Article {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  imagePath?: string; // Store the storage path for deletion
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

// Helper function to create slug from title
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
};

// Helper function to create excerpt from content
const createExcerpt = (content: string, maxLength: number = 150): string => {
  const textContent = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
  return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent;
};

// Upload image to Firebase Storage
export const uploadArticleImage = async (file: File, articleId?: string): Promise<{ url: string; path: string }> => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const imagePath = `articles/${articleId || "temp"}/${fileName}`;
    const imageRef = ref(storage, imagePath);

    const snapshot = await uploadBytes(imageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    return { url, path: imagePath };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

// Delete image from Firebase Storage
export const deleteArticleImage = async (imagePath: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw error for image deletion to avoid breaking the main operation
  }
};

// Create new article
export const createArticle = async (data: CreateArticleData): Promise<Article> => {
  try {
    const slug = createSlug(data.title);
    const excerpt = createExcerpt(data.content);
    const now = Timestamp.now();

    // First create the article document
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

    // Upload image if provided
    if (data.image) {
      const uploadResult = await uploadArticleImage(data.image, docRef.id);
      imageUrl = uploadResult.url;
      imagePath = uploadResult.path;

      // Update the document with image information
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

// Get all articles with pagination
export const getArticles = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  statusFilter?: "all" | "published" | "draft"
): Promise<{ articles: Article[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let q = query(collection(db, "articles"), orderBy("createdAt", "desc"), firestoreLimit(pageSize));

    // Add status filter
    if (statusFilter && statusFilter !== "all") {
      q = query(collection(db, "articles"), where("status", "==", statusFilter), orderBy("createdAt", "desc"), firestoreLimit(pageSize));
    }

    // Add pagination
    if (lastDoc) {
      q = query(collection(db, "articles"), orderBy("createdAt", "desc"), startAfter(lastDoc), firestoreLimit(pageSize));
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
    throw new Error("Failed to get articles");
  }
};

// Get article by ID
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

// Get article by slug
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

// Update article
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

    // Update title and create new slug if title changed
    if (data.title && data.title !== currentData.title) {
      updateData.title = data.title;
      updateData.slug = createSlug(data.title);
    }

    // Update content and excerpt if content changed
    if (data.content && data.content !== currentData.content) {
      updateData.content = data.content;
      updateData.excerpt = createExcerpt(data.content);
    }

    // Update status
    if (data.status) {
      updateData.status = data.status;
    }

    // Handle image update
    if (data.image) {
      // Delete old image if exists
      if (currentData.imagePath) {
        await deleteArticleImage(currentData.imagePath);
      }

      // Upload new image
      const uploadResult = await uploadArticleImage(data.image, id);
      updateData.imageUrl = uploadResult.url;
      updateData.imagePath = uploadResult.path;
    }

    await updateDoc(docRef, updateData);

    // Return updated article
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

// Delete article
export const deleteArticle = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Article not found");
    }

    const articleData = docSnap.data() as Article;

    // Delete associated image if exists
    if (articleData.imagePath) {
      await deleteArticleImage(articleData.imagePath);
    }

    // Delete the document
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting article:", error);
    throw new Error("Failed to delete article");
  }
};

// Search articles
export const searchArticles = async (searchTerm: string): Promise<Article[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation that searches by title
    // For production, consider using Algolia or other search services

    const q = query(collection(db, "articles"), where("status", "==", "published"), orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      const articleData = doc.data() as Article;
      const article = {
        id: doc.id,
        ...articleData,
      };

      // Filter by search term (case-insensitive)
      if (article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        articles.push(article);
      }
    });

    return articles;
  } catch (error) {
    console.error("Error searching articles:", error);
    throw new Error("Failed to search articles");
  }
};

// Get published articles for public display
export const getPublishedArticles = async (limit?: number): Promise<Article[]> => {
  try {
    // First try the optimized query with compound index
    let q;
    if (limit) {
      q = query(
        collection(db, "articles"), 
        where("status", "==", "published"), 
        orderBy("createdAt", "desc"), 
        firestoreLimit(limit)
      );
    } else {
      q = query(
        collection(db, "articles"), 
        where("status", "==", "published"), 
        orderBy("createdAt", "desc")
      );
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
    // Fallback: Get all articles and filter in memory
    try {
      // Simple query without orderBy to avoid index issues
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

      // Sort by createdAt in memory
      articles.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
        return dateB.getTime() - dateA.getTime();
      });

      // Apply limit if specified
      const limitedArticles = limit ? articles.slice(0, limit) : articles;
      
      return limitedArticles;
    } catch (fallbackError) {
      // Last resort: return empty array instead of throwing
      return [];
    }
  }
};
