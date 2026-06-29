import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import generateChatResponse from "@/lib/generateChatResponse";
import ConnectDb from "@/lib/mongodb";
import Chat from "@/models/chat";
import { chatRateLimit } from "@/lib/ratelimit";
import {chatSchema} from "@/lib/validation/chatSchema";
export async function POST(request) {
  const body = await request.json();

  const parsed = chatSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0].message,
      },
      {
        status: 400,
      }
    );
  }

  const { message } = parsed.data;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        response: "Please sign in to chat with AniMind and receive personalized anime recommendations.",
      },
      { status: 401 }
    );
  }
  const userId = session.user.id;
  const identifier =
    session?.user?.id ??
    request.headers.get("x-forwarded-for") ??
    "anonymous";
  const { success } = await chatRateLimit.limit(identifier);
  if (!success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a minute before trying again.",
      },
      {
        status: 429,
      }
    );
  }
  const response = await generateChatResponse(message, userId);
  await ConnectDb();
  await Chat.findOneAndUpdate(
    { userId: session.user.id },
    {
      $push: {
        messages: {
          $each: [
            {
              role: "user",
              content: message,
            },
            {
              role: "assistant",
              content: response,
            },
          ],
          $slice: -30,
        },
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    }
  );

  return NextResponse.json({
    response,
  });
}