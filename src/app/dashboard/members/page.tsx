"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Upload } from "lucide-react";
import { MembersTable } from "./members-table";
import { AddMemberDialog } from "./add-member-dialog";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function MembersPage() {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !firestore) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        if (json.length === 0) {
          toast({
            variant: "destructive",
            title: "Erreur d'importation",
            description: "Le fichier Excel est vide ou mal formaté.",
          });
          return;
        }

        const membersCollection = collection(firestore, "members");
        let importedCount = 0;
        
        json.forEach((row: any) => {
          // Adapter les noms de colonnes à votre modèle Member
          const memberData = {
            name: row["Nom"] || "",
            email: row["Email"] || "",
            phone: row["Téléphone"] || "",
            address: row["Adresse"] || "",
            status: row["Statut"] === "Actif" ? "Actif" : "Inactif",
            role: row["Rôle"] === "admin" ? "admin" : "membre",
            doc: ["M", "C", ""].includes(row["Doc"]) ? row["Doc"] : "",
            memo: row["Memo"] || "",
          };
          addDocumentNonBlocking(membersCollection, memberData);
          importedCount++;
        });

        toast({
          title: "Importation réussie",
          description: `${importedCount} membres ont été importés avec succès.`,
        });

      } catch (error) {
        console.error("Erreur lors de l'importation :", error);
        toast({
          variant: "destructive",
          title: "Erreur d'importation",
          description: "Un problème est survenu lors de la lecture du fichier. Assurez-vous qu'il est au bon format.",
        });
      }
    };
    reader.readAsBinaryString(file);

    // Reset file input
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Membres</h1>
        <div className="flex gap-2">
            <Button onClick={handleImportClick}>
              <Upload className="mr-2 h-4 w-4" />
              Importer
            </Button>
            <Button onClick={() => setIsAddMemberOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un membre
            </Button>
        </div>
      </div>
      <MembersTable />
      <AddMemberDialog
        isOpen={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".xlsx, .xls"
      />
    </div>
  );
}
