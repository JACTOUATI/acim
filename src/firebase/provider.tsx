
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { useToast } from '@/hooks/use-toast';

interface MemberData {
  role: 'admin' | 'membre';
}

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  memberData: MemberData | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  memberData: MemberData | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  memberData: MemberData | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useUser()
export interface UserHookResult {
  user: User | null;
  memberData: MemberData | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    memberData: null,
    isUserLoading: true,
    userError: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!auth || !firestore) {
      setUserAuthState({ user: null, memberData: null, isUserLoading: false, userError: new Error("Auth or Firestore service not provided.") });
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          const membersRef = collection(firestore, "members");
          const q = query(membersRef, where("email", "==", firebaseUser.email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: "Membre non autorisé. Veuillez contacter l'ACIM.",
            });
            await firebaseUser.delete();
            setUserAuthState({ user: null, memberData: null, isUserLoading: false, userError: null });
          } else {
            const memberDoc = querySnapshot.docs[0];
            const memberData = memberDoc.data() as MemberData;
            setUserAuthState({ user: firebaseUser, memberData, isUserLoading: false, userError: null });
          }
        } else {
          setUserAuthState({ user: null, memberData: null, isUserLoading: false, userError: null });
        }
      },
      (error) => {
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, memberData: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe();
  }, [auth, firestore, toast]);

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      memberData: userAuthState.memberData,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    memberData: context.memberData,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

export const useUser = (): UserHookResult => {
  const { user, memberData, isUserLoading, userError } = useFirebase();
  return { user, memberData, isUserLoading, userError };
};
