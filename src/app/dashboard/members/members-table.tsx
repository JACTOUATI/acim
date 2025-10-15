"use client";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFirestore } from "@/firebase";
import { DeleteMemberDialog } from "./delete-member-dialog";

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Actif" | "Inactif";
  doc?: string;
  memo?: string;
};

type MembersTableProps = {
  members: Member[];
  isLoading: boolean;
};

export function MembersTable({ members, isLoading }: MembersTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleDeleteClick = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div>Chargement des membres...</div>;
  }
  
  if (!members || members.length === 0) {
    return <div className="text-center py-8">Aucun membre trouvé.</div>
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Doc</TableHead>
              <TableHead>Memo</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>
                  <Badge
                    variant={member.status === "Actif" ? "default" : "secondary"}
                    className={member.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell>{member.doc}</TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {member.memo}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={() => handleEditClick(member)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(member)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedMember && (
        <DeleteMemberDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          member={selectedMember}
        />
      )}
    </>
  );
}
