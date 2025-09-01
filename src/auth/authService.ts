import { auth } from './AuthFirebase';
import type { User } from 'firebase/auth';

export interface AuthenticatedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  token: string;
}

export const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    return null;
  }
};

export const getCurrentUser = async (): Promise<AuthenticatedUser | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const token = await user.getIdToken();
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      token
    };
  } catch (error) {
    return null;
  }
};

export const waitForAuth = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};
