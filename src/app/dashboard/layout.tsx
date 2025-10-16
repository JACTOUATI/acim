
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
import { useRouter, usePathname } from "next/navigation";
import { Home, Users, LogOut, ChevronDown, Settings, CreditCard, ShoppingCart, Calendar, Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DashboardHeader } from "./header";

function AcimLogo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/etoile.png"
        alt="ACIM Logo"
        width={32}
        height={32}
        className="h-8 w-8"
      />
      <h1 className="text-xl font-bold text-primary">ACIM</h1>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, memberData } = useUser();
  const router = useRouter();
  const pathname = usePathname();

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
  
  const isLinkActive = (path: string) => pathname === path;


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <AcimLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/dashboard">
                    <SidebarMenuButton tooltip="Accueil" isActive={isLinkActive('/dashboard')}>
                        <Home />
                        Accueil
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/dashboard/members">
                    <SidebarMenuButton tooltip="Membres" isActive={isLinkActive('/dashboard/members')}>
                        <Users />
                        Membres
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Transactions">
                <CreditCard />
                Transactions
                <ChevronDown className="ml-auto h-4 w-4" />
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
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Événements">
                <Calendar />
                Événements
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Vente de bougies">
                <Gift />
                Vente de bougies
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Boutique">
                <ShoppingCart />
                Boutique
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            {user && (
                 <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL ?? ''} alt="User avatar" />
                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                        <span className="font-medium text-foreground">{user.displayName ?? user.email}</span>
                        {memberData?.role && <span className="text-xs text-muted-foreground capitalize">{memberData.role}</span>}
                    </div>
                </div>
            )}
           
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="p-4 lg:p-6">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
