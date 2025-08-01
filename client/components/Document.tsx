import { db } from "@/firebase";
import useOwner from "@/lib/useOwner";
import { doc, updateDoc } from "firebase/firestore";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import DeleteDocument from "./DeleteDocument";
import Editor from "./Editor";
import InviteUser from "./InviteUser";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

function Document({ id }: { id: string }) {
  const [data] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();
  const [showAvatars, setShowAvatars] = useState(false);

  // ✅ Safely trigger avatars visibility after mount
  useEffect(() => {
    startTransition(() => {
      setShowAvatars(true);
    });
  }, []);

  const isOwner = useOwner();

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
              <InviteUser />
              {/* Delete doc */}
              <DeleteDocument />
            </>
          )}
        </form>
      </div>

      <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
        {/* Mange Users */}
        <ManageUsers />

        {/* Avatar */}
        {showAvatars && <Avatars />}
      </div>
      <hr className="pb-10" />

      <Editor />
    </div>
  );
}
export default Document;
