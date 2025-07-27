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
