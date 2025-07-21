"use server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
  // Enforce that the user is signed in
  auth.protect();

  // Retrieve the session claims from the authentication context
  const { sessionClaims } = await auth();

  // Explicitly check if the email exists in the session claims
  const email = sessionClaims?.email;

  if (!email) {
    // If no email is found, throw an error to indicate the issue
    throw new Error("createNewDocument: no email found on sessionClaims");
  }

  // At this point, we can safely use the `email` variable
  // Get a reference to the 'documents' collection in the Firestore database
  const docCollectionRef = adminDb.collection("documents");

  // Add a new document to the 'documents' collection with a default title
  const docRef = await docCollectionRef.add({ title: "New Doc" });

  // Get a reference to the user's 'rooms' collection and add a new room document
  // The document includes details such as the user's role, creation date, and room ID
  await adminDb
    .collection("users")
    .doc(email) // Use the email as the document ID
    .collection("rooms")
    .doc(docRef.id) // Use the new document's ID
    .set({
      userId: email,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  // Return the ID of the newly created document
  return { docId: docRef.id };
}

export async function deleteDocument(roomId: string) {
  auth.protect();

  try {
    // Delete the document reference itself
    await adminDb.collection("documents").doc(roomId).delete();

    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();
    // Delete the room reference in the user's collection for every user in the room
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Delete the room from Liveblocks
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  auth.protect();

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId,
      });

    return { success: true };
  } catch (error) {
    console.error("Error inviting user to document:", error);
    return { success: false };
  }
}
