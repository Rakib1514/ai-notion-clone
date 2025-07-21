"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/firebase";
import useOwner from "@/lib/useOwner";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { collectionGroup, query, where } from "firebase/firestore";
import { useState, useTransition } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { removeUserFromDocument } from "@/actions/actions";

function ManageUsers() {
  const { user } = useUser();
  const isOwner = useOwner();
  const room = useRoom();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      if (!user) return;

      const { success } = await removeUserFromDocument(room.id, userId);

      if (success) {
        toast.success("User removed!");
      } else {
        toast.error("Failed to remove user");
        console.error("Failed to remove user from document");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" asChild>
        <DialogTrigger>Users ({usersInRoom?.docs.length})</DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>User With Access</DialogTitle>
          <DialogDescription>
            Here you can manage users who have access to this document.
          </DialogDescription>
        </DialogHeader>

        <hr className="my-2" />

        <div className="flex flex-col space-y-2">
          {
            // Map through the users who have access to the document
            usersInRoom?.docs.map((doc) => {
              const userData = doc.data();
              return (
                <div
                  key={userData.userId}
                  className="flex justify-between items-center mb-2"
                >
                  <span className="font-light">{userData.userId}</span>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" className="capitalize">
                      {userData.role}
                    </Button>

                    {
                      // Only show delete button if the user is the owner
                      isOwner &&
                        userData.userId !==
                          user?.emailAddresses[0].toString() && (
                          <Button
                            variant="destructive"
                            size={"sm"}
                            disabled={isPending}
                            onClick={() => handleDelete(userData.userId)}
                          >
                            {isPending ? "Removing..." : "X"}
                          </Button>
                        )
                    }
                  </div>
                </div>
              );
            })
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default ManageUsers;
