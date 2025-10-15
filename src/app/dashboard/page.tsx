"use client";

import { useUser } from "@/firebase/provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Tableau de bord
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Bienvenue !</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Vous êtes connecté en tant que {user.email}</p>
        </CardContent>
      </Card>
    </div>
  );
}
