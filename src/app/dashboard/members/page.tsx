"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { MembersTable } from "./members-table";
import { AddMemberDialog } from "./add-member-dialog";
import { useState } from "react";

export default function MembersPage() {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Membres</h1>
        <Button onClick={() => setIsAddMemberOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>
      <MembersTable />
      <AddMemberDialog
        isOpen={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
      />
    </div>
  );
}
