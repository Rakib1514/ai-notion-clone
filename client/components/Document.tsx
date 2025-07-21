import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";

function Document({ id }: { id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();

  const isOwner = useOwner()

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
    <div className="flex-1 h-full bg-white p-5">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form onSubmit={updateTitle} className="flex space-x-2 w-full">
          {/* Update Title */}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-white"
          />

          {/* Update doc name button */}
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>

          {isOwner && (
            <>
            {/* Invite User */}

            {/* Delete doc */}
              <DeleteDocument  />
            </>
          )}
          
        </form>
      </div>

      <div>
        {/* Mange Users */}

        {/* Avatar */}
      </div>
      <hr className="pb-10" />

      <Editor />
    </div>
  );
}
export default Document;
