"use client";

import { useUser } from "@/firebase/provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAuth, signOut } from "firebase/auth";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);
  
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      router.push('/');
    }).catch((error) => {
      console.error("Erreur de déconnexion", error);
    });
  };

  if (isUserLoading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenue sur votre tableau de bord
      </h1>
      <p className="mb-6">Vous êtes connecté en tant que {user.email}</p>
      <Button onClick={handleLogout}>Se déconnecter</Button>
    </div>
  );
}
