import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";

function Document({ id }: { id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();

  useEffect(() => {
    if (data) setInput(data.title);
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      startTransition(async () => {
        // Update title
        await updateDoc(doc(db, "documents", id), { title: input });
      });
    }
  };

  return (
    <div>
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form onSubmit={updateTitle} className="flex space-x-2 w-full">
          {/* Update Title */}
          <Input value={input} onChange={(e) => setInput(e.target.value)} className="bg-white"/>

          {/* If (isOwner) && inviteUser, DeleteDocument */}
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </form>
      </div>

      <div>
        {/* Mange Users */}

        {/* Avatar */}
      </div>

      {/* Collaborative Editor */}
    </div>
  );
}
export default Document;
