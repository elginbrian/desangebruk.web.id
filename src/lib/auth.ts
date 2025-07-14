import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt?: Date;
}

export interface AuthError {
  code: string;
  message: string;
}

export const signUpWithEmail = async (email: string, password: string, name: string): Promise<{ user: User; profile: UserProfile } | { error: AuthError }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name,
    });

    const userProfile: UserProfile = {
      uid: user.uid,
      email: email,
      name: name,
      role: "admin",
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", user.uid), userProfile);

    return { user, profile: userProfile };
  } catch (error: any) {
    return {
      error: {
        code: error.code,
        message: getAuthErrorMessage(error.code),
      },
    };
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<{ user: User; profile: UserProfile } | { error: AuthError }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const profile = userDoc.data() as UserProfile;
      return { user, profile };
    } else {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        name: user.displayName || "Admin",
        role: "admin",
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", user.uid), userProfile);
      return { user, profile: userProfile };
    }
  } catch (error: any) {
    return {
      error: {
        code: error.code,
        message: getAuthErrorMessage(error.code),
      },
    };
  }
};

export const signOutUser = async (): Promise<void | { error: AuthError }> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    return {
      error: {
        code: error.code,
        message: getAuthErrorMessage(error.code),
      },
    };
  }
};

export const resetPassword = async (email: string): Promise<void | { error: AuthError }> => {
  try {
    const actionCodeSettings = {
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    };

    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  } catch (error: any) {
    return {
      error: {
        code: error.code,
        message: getAuthErrorMessage(error.code),
      },
    };
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const updateUserProfile = async (uid: string, updateData: Partial<UserProfile>): Promise<{ profile: UserProfile } | { error: AuthError }> => {
  try {
    const userDocRef = doc(db, "users", uid);

    await updateDoc(userDocRef, {
      ...updateData,
      updatedAt: new Date(),
    });

    const updatedDoc = await getDoc(userDocRef);
    if (updatedDoc.exists()) {
      const profile = updatedDoc.data() as UserProfile;

      if (updateData.name && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: updateData.name,
        });
      }

      return { profile };
    } else {
      return {
        error: {
          code: "profile/not-found",
          message: "Profil pengguna tidak ditemukan",
        },
      };
    }
  } catch (error: any) {
    return {
      error: {
        code: error.code,
        message: getAuthErrorMessage(error.code),
      },
    };
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "Akun tidak ditemukan. Silakan periksa email Anda.";
    case "auth/wrong-password":
      return "Kata sandi salah. Silakan coba lagi.";
    case "auth/email-already-in-use":
      return "Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.";
    case "auth/weak-password":
      return "Kata sandi terlalu lemah. Gunakan minimal 6 karakter.";
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/user-disabled":
      return "Akun telah dinonaktifkan.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Silakan coba lagi nanti.";
    case "auth/network-request-failed":
      return "Koneksi internet bermasalah. Silakan periksa koneksi Anda.";
    case "profile/not-found":
      return "Profil pengguna tidak ditemukan.";
    case "auth/missing-email":
      return "Email harus diisi.";
    default:
      return "Terjadi kesalahan. Silakan coba lagi.";
  }
};

