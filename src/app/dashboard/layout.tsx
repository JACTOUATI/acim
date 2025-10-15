"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarProvider,
  SidebarContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/firebase/provider";
import { Button } from "@/components/ui/button";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Home, Users, LogOut, ChevronDown, Settings } from "lucide-react";
import Image from "next/image";
import { DashboardHeader } from "./header";

function AcimLogo() {
  return (
    <div className="flex flex-col items-center text-center">
      <Image
        src="/etoile.png"
        alt="ACIM Logo"
        width={40}
        height={40}
        className="h-10 w-10"
      />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Erreur de déconnexion", error);
      });
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <AcimLogo />
                <h1 className="text-xl font-semibold">ACIM</h1>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard">
                <Home />
                Accueil
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings />
                Paramètres
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="/dashboard/members" isActive>Membres</SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <ChevronDown />
                Transactions
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="#">Dons</SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="#">Cotisations</SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            {user && (
                 <div className="flex items-center gap-2 p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL ?? ''} alt="User avatar" />
                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                        <span className="font-medium">{user.displayName ?? user.email}</span>
                    </div>
                </div>
            )}
           
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <div className="p-4">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
