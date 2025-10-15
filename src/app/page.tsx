"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

function AcimLogo() {
  return (
    <div className="flex flex-col items-center text-center">
      <svg
        className="h-16 w-16 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        <path d="M12 2l-3.09 6.26L2 9.27l5 4.87-1.18 6.88L12 17.77l6.18 3.25L17 14.14l5-4.87-6.91-1.01L12 2z" />
         <path d="M2 9.27h20" />
         <path d="M7 14.14l-4 3.86" />
        <path d="M17 14.14l4 3.86" />
      </svg>
      <span className="text-lg font-bold tracking-wider">ACIM</span>
    </div>
  );
}


export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left: Image */}
          <div className="col-span-1 flex items-center justify-center">
             <Image
                src="https://picsum.photos/seed/1/400/600"
                alt="Western Wall"
                width={400}
                height={600}
                className="rounded-xl object-cover shadow-lg"
                data-ai-hint="western wall jerusalem"
            />
          </div>

          {/* Middle: Login/Signup Form */}
          <div className="col-span-1">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="items-center text-center">
                 <AcimLogo />
                 <CardTitle className="text-2xl font-bold">ACIM</CardTitle>
                 <CardDescription>Connectez-vous ou créez votre compte</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Se connecter</TabsTrigger>
                    <TabsTrigger value="signup">S'inscrire</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <form className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="jjmn.touati@free.fr" required />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Mot de passe</Label>
                            <a href="#" className="text-sm text-blue-600 hover:underline">Mot de passe oublié ?</a>
                        </div>
                        <div className="relative">
                            <Input id="password" type={passwordVisible ? "text" : "password"} required defaultValue="********" />
                            <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                                {passwordVisible ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                            </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="font-normal">Se souvenir de moi</Label>
                      </div>
                      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        Se connecter
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="signup">
                    <form className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Nom complet</Label>
                        <Input id="signup-name" type="text" placeholder="Votre nom" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input id="signup-email" type="email" placeholder="email@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Mot de passe</Label>
                        <Input id="signup-password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        S'inscrire
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right: Donation Card */}
          <div className="col-span-1 flex items-center justify-center">
            <Card className="w-full max-w-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold">Faire un don</CardTitle>
                <CardDescription>Soutenez notre association</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center space-y-6">
                <Heart className="h-16 w-16 text-green-500" strokeWidth={1} />
                <p className="text-sm text-gray-600">
                  Votre générosité nous aide à poursuivre nos actions. Chaque contribution, petite ou grande, fait une réelle différence.
                </p>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  <Heart className="mr-2 h-4 w-4" />
                  Donner maintenant
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
