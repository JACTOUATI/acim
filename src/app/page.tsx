
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Heart } from "lucide-react";
import Image from "next/image";
import { useAuth, useUser } from "@/firebase/provider";
import { initiateEmailSignIn, initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

function AcimLogo() {
  return (
    <div className="flex flex-col items-center text-center mb-4">
      <Image 
        src="/etoile.png" 
        alt="ACIM Logo"
        width={64}
        height={64}
        className="h-16 w-16 mb-2"
      />
      <h1 className="text-2xl font-bold text-primary">ACIM</h1>
    </div>
  );
}

function LoginForm() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loginEmail, setLoginEmail] = useState("jjmn.touati@free.fr");
    const [loginPassword, setLoginPassword] = useState("password"); // Example value
    const auth = useAuth();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginEmail || !loginPassword) {
            toast({ variant: "destructive", title: "Erreur", description: "Veuillez remplir l'email et le mot de passe." });
            return;
        }
        try {
            await initiateEmailSignIn(auth, loginEmail, loginPassword);
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Erreur de connexion",
                description: "Email ou mot de passe incorrect.",
            });
        }
    };

    return (
         <form className="space-y-4 pt-4" onSubmit={handleLogin}>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <a href="#" className="text-sm text-primary hover:underline">Mot de passe oublié ?</a>
                 </div>
                <div className="relative">
                    <Input id="password" type={passwordVisible ? "text" : "password"} required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                    <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {passwordVisible ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                </div>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="text-sm font-normal">Se souvenir de moi</Label>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Se connecter
            </Button>
        </form>
    )
}

function SignupForm() {
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const auth = useAuth();
    const { toast } = useToast();

     const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signupEmail || !signupPassword) {
            toast({ variant: "destructive", title: "Erreur", description: "Veuillez remplir tous les champs." });
            return;
        }
        try {
            await initiateEmailSignUp(auth, signupEmail, signupPassword);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur d'inscription",
                description: error.message,
            });
        }
    };

    return (
         <form className="space-y-4 pt-4" onSubmit={handleSignup}>
            <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="email@example.com" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="signup-password">Mot de passe</Label>
                <Input id="signup-password" type="password" required value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                S'inscrire
            </Button>
        </form>
    )
}

function DonationCard() {
    return (
        <Card className="w-full h-full flex flex-col bg-white/60 backdrop-blur-sm border-none shadow-none">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Faire un don</CardTitle>
                <CardDescription>Soutenez notre association</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 items-center justify-center text-center gap-4">
                <Heart className="h-20 w-20 text-green-500" strokeWidth={1} />
                <p className="text-sm text-muted-foreground">
                    Votre générosité nous aide à poursuivre nos actions. Chaque contribution, petite ou grande, fait une réelle différence.
                </p>
                <Button className="w-full">
                    <Heart className="mr-2 h-4 w-4" /> Donner maintenant
                </Button>
            </CardContent>
        </Card>
    );
}


export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full items-stretch">
            
            {/* Left Column: Image */}
            <div className="hidden lg:flex items-stretch justify-center">
                <Image 
                    src="/mur.jpg"
                    alt="Mur des lamentations"
                    width={400}
                    height={600}
                    className="rounded-xl shadow-2xl object-cover w-full h-full"
                />
            </div>

            {/* Middle Column: Login Form */}
             <main className="w-full max-w-md mx-auto col-span-1 flex items-center">
                <Card className="w-full shadow-2xl">
                <CardHeader className="items-center">
                    <AcimLogo />
                    <CardDescription className="text-center">Connectez-vous ou créez votre compte</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Se connecter</TabsTrigger>
                        <TabsTrigger value="signup">S'inscrire</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <LoginForm />
                    </TabsContent>
                    <TabsContent value="signup">
                        <SignupForm />
                    </TabsContent>
                    </Tabs>
                </CardContent>
                </Card>
            </main>

            {/* Right Column: Donation */}
            <div className="hidden lg:flex items-stretch justify-center">
                 <DonationCard />
            </div>

        </div>
    </div>
  );
}
