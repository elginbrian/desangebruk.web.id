import { collection, query, getDocs, doc, updateDoc, deleteDoc, orderBy, where, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile } from "./auth";

export interface UserListItem extends UserProfile {
  id: string;
}

export const getAllUsers = async (): Promise<UserListItem[]> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const users: UserListItem[] = [];

    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      } as UserListItem);
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export const getUsersByRole = async (role: "admin" | "pending"): Promise<UserListItem[]> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", role), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const users: UserListItem[] = [];

    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      } as UserListItem);
    });

    return users;
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw new Error("Failed to fetch users by role");
  }
};

export const updateUserRole = async (userId: string, newRole: "admin" | "pending"): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};

export const getUsersWithPagination = async (page: number = 1, pageSize: number = 10, roleFilter: "all" | "admin" | "pending" = "all"): Promise<{ users: UserListItem[]; totalPages: number; totalItems: number }> => {
  try {
    const offset = (page - 1) * pageSize;

    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));
    const totalSnapshot = await getDocs(q);

    const allUsers: UserListItem[] = [];
    totalSnapshot.forEach((doc) => {
      const data = doc.data();
      allUsers.push({
        id: doc.id,
        ...data,
      } as UserListItem);
    });

    let filteredUsers = allUsers;
    if (roleFilter !== "all") {
      filteredUsers = allUsers.filter((user) => user.role === roleFilter);
    }

    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedUsers = filteredUsers.slice(offset, offset + pageSize);

    return {
      users: paginatedUsers,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching users with pagination:", error);
    throw new Error("Failed to fetch users with pagination");
  }
};

export const searchUsers = async (searchTerm: string): Promise<UserListItem[]> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const users: UserListItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const user: UserListItem = {
        id: doc.id,
        ...data,
      } as UserListItem;

      if ((user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) || (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))) {
        users.push(user);
      }
    });

    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Failed to search users");
  }
};

export const getUserStats = async () => {
  try {
    const [allUsers, pendingUsers, adminUsers] = await Promise.all([getAllUsers(), getUsersByRole("pending"), getUsersByRole("admin")]);

    return {
      totalUsers: allUsers.length,
      pendingUsers: pendingUsers.length,
      adminUsers: adminUsers.length,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw new Error("Failed to fetch user stats");
  }
};
