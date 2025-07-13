"use server";

import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
  // enforce the user is signed in
  auth.protect();

  // get the session claims
  const { sessionClaims, userId } = await auth();

  console.log(sessionClaims, userId);

  // explicitly check for email
  const email = sessionClaims?.email;
  if (!email) {
    throw new Error("createNewDocument: no email found on sessionClaims");
  }

  // now use `email` safely
  const docCollectionRef = adminDb.collection("documents");
  const docRef = await docCollectionRef.add({ title: "New Doc" });

  await adminDb
    .collection("users")
    .doc(email)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: email,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
}
