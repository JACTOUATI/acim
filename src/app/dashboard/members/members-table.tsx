"use client";
import React, { useState, useMemo } from "react";
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
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { DeleteMemberDialog } from "./delete-member-dialog";

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Actif" | "Inactif";
  doc?: string;
  memo?: string;
};

type MembersTableProps = {
  searchTerm: string;
};

export function MembersTable({ searchTerm }: MembersTableProps) {
  const firestore = useFirestore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const membersQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, "members"), orderBy("name", "asc"))
        : null,
    [firestore]
  );
  const { data: members, isLoading } = useCollection<Member>(membersQuery);

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    if (!searchTerm) return members;

    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.memo &&
          member.memo.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [members, searchTerm]);

  const handleDeleteClick = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div>Chargement des membres...</div>;
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
            {filteredMembers?.map((member) => (
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
