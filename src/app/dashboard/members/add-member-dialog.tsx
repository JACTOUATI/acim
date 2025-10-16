"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const memberSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("L'adresse email est invalide").or(z.literal("")).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["Actif", "Inactif"]),
  role: z.enum(["admin", "membre"]),
  doc: z.enum(["M", "C", "none", ""]).optional(),
  memo: z.string().optional(),
});

type AddMemberDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function AddMemberDialog({
  isOpen,
  onOpenChange,
}: AddMemberDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "Actif",
      role: "membre",
      doc: "none",
      memo: "",
    },
  });

  const onSubmit = (values: z.infer<typeof memberSchema>) => {
    if (!firestore) return;
    
    const dataToSave = {
        ...values,
        doc: values.doc === "none" ? "" : values.doc,
    };

    const membersCollection = collection(firestore, "members");
    addDocumentNonBlocking(membersCollection, dataToSave);
    toast({
        title: "Membre ajouté",
        description: `${values.name} a été ajouté à la liste des membres.`,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau membre</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour ajouter un nouveau
            membre.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                        <Input placeholder="Jean Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                        <Input placeholder="0612345678" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                        <Input placeholder="123 rue de Paris" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Inactif">Inactif</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="membre">Membre</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="doc"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Doc</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type de doc" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="none">Aucun</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="memo"
                render={({ field }) => (
                    <FormItem className="col-span-2">
                    <FormLabel>Memo</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Notes complémentaires..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
