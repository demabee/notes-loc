import { auth, db } from '@/config/firebaseConfig';
import { getFirebaseErrorMessage } from '@/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react';

type AutoSignInResponse = {
  success: boolean;
  message: string;
  data?: User;
};

export default function useAuth() {
  const [loading, setLoading] = useState<boolean>(false);
  const [autoSigninloading, setAutoSigninLoading] = useState<boolean>(false);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      const userDocRef = doc(db, 'users', user.uid);
      const res = await setDoc(userDocRef, {
        email: user.email,
        id: user.uid,
        displayName: user.displayName,
        createdAt: serverTimestamp(),
      });
      return {
        success: true,
        message: 'Succesfully created account',
        data: userCredential.user
      };
    } catch (error: any) {
      console.error('signUp Error', error.message);
      return {
        success: false,
        message: getFirebaseErrorMessage(error.code)
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem('userCredentials', JSON.stringify({ email, password, rememberMe }));
      return {
        success: true,
        message: 'Succesfully signed in account',
        data: userCredential.user
      };
    } catch (error: any) {
      console.error('signIn Error', error.message);
      return {
        success: false,
        message: getFirebaseErrorMessage(error.code)
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const autoSignIn = useCallback(async (): Promise<AutoSignInResponse> => {
    try {
      setAutoSigninLoading(true);
      const credentials = await AsyncStorage.getItem('userCredentials');
      if (credentials) {
        const { email, password } = JSON.parse(credentials);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return {
          success: true,
          message: 'Succesfully signed in account',
          data: userCredential.user
        };
      }

      return {
        success: false,
        message: 'Error in signing in',
      };
    } catch (error: any) {
      console.error('signIn Error', error.message);
      return {
        success: false,
        message: getFirebaseErrorMessage(error.code)
      }
    } finally {
      setAutoSigninLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      await AsyncStorage.removeItem('userCredentials');
      return {
        success: true,
        message: 'Successfully signed out',
      };
    } catch (error: any) {
      console.error('signOut Error', error.message);
      return {
        success: false,
        message: getFirebaseErrorMessage(error.code),
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    signUp,
    signIn,
    autoSignIn,
    signOut,
    loading,
    autoSigninloading
  }
}