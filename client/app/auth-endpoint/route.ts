import { adminDb } from "../../firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface RoomRequestBody {
  room: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { sessionClaims } = await auth();

  if (!sessionClaims?.email) {
    return NextResponse.json(
      { message: "Unauthorized: missing email in session" },
      { status: 401 }
    );
  }

  let body: RoomRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const { room } = body;

  if (!room) {
    return NextResponse.json(
      { message: "Room is required" },
      { status: 400 }
    );
  }

  const session = liveblocks.prepareSession(sessionClaims.email, {
    userInfo: {
      name: sessionClaims.fullName ?? "",
      email: sessionClaims.email,
      avatar: sessionClaims.image ?? "",
    },
  });

  const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", sessionClaims.email)
    .get();

  const userInRoom = usersInRoom.docs.find((doc: any) => doc.id === room);

  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);
    const { body: authBody, status } = await session.authorize();

    return new NextResponse(authBody, { status });
  } else {
    return NextResponse.json(
      { message: "You are not in this room" },
      { status: 403 }
    );
  }
}
