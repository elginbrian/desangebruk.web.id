import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, updateProfile, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt?: Date;
}

// Auth error interface
export interface AuthError {
  code: string;
  message: string;
}

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, name: string): Promise<{ user: User; profile: UserProfile } | { error: AuthError }> => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with name
    await updateProfile(user, {
      displayName: name,
    });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: email,
      name: name,
      role: "admin", // Default role
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

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<{ user: User; profile: UserProfile } | { error: AuthError }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const profile = userDoc.data() as UserProfile;
      return { user, profile };
    } else {
      // Create profile if doesn't exist (for existing users)
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

// Sign in with Google
export const signInWithGoogle = async (): Promise<{ user: User; profile: UserProfile } | { error: AuthError }> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user profile exists
    const userDoc = await getDoc(doc(db, "users", user.uid));

    let profile: UserProfile;
    if (userDoc.exists()) {
      profile = userDoc.data() as UserProfile;
    } else {
      // Create new profile for Google user
      profile = {
        uid: user.uid,
        email: user.email || "",
        name: user.displayName || "Admin",
        role: "admin",
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", user.uid), profile);
    }

    return { user, profile };
  } catch (error: any) {
    return {
      error: {
        code: error.code,
        message: getAuthErrorMessage(error.code),
      },
    };
  }
};

// Sign out
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

// Send password reset email
export const resetPassword = async (email: string): Promise<void | { error: AuthError }> => {
  try {
    // Configure action code settings for password reset
    const actionCodeSettings = {
      url: `${window.location.origin}/login`, // URL to redirect after password reset
      handleCodeInApp: false, // This will be handled by Firebase's default reset page
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

// Get user profile from Firestore
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

// Update user profile
export const updateUserProfile = async (uid: string, updateData: Partial<UserProfile>): Promise<{ profile: UserProfile } | { error: AuthError }> => {
  try {
    const userDocRef = doc(db, "users", uid);

    // Update document in Firestore
    await updateDoc(userDocRef, {
      ...updateData,
      updatedAt: new Date(),
    });

    // Get updated profile
    const updatedDoc = await getDoc(userDocRef);
    if (updatedDoc.exists()) {
      const profile = updatedDoc.data() as UserProfile;

      // Also update Firebase Auth display name if name was changed
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

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Helper function to get user-friendly error messages
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
    case "auth/popup-closed-by-user":
      return "Jendela masuk ditutup. Silakan coba lagi.";
    case "auth/cancelled-popup-request":
      return "Permintaan masuk dibatalkan.";
    case "profile/not-found":
      return "Profil pengguna tidak ditemukan.";
    case "auth/user-not-found":
      return "Email tidak ditemukan. Silakan periksa email Anda atau buat akun baru.";
    case "auth/invalid-email":
      return "Format email tidak valid. Silakan periksa kembali email Anda.";
    case "auth/missing-email":
      return "Email harus diisi.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan reset password. Silakan tunggu beberapa menit sebelum mencoba lagi.";
    default:
      return "Terjadi kesalahan saat mengirim email reset password. Silakan coba lagi.";
  }
};
