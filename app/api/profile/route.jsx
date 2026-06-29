import ConnectDb from "@/lib/mongodb";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PUT(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { username, profilePic } = await request.json();
    await ConnectDb();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (username) {
        const existingUser = await User.findOne({
            username: username.toLowerCase(),
        });

        if (
            existingUser &&
            existingUser._id.toString() !== user._id.toString()
        ) {
            return NextResponse.json(
                { error: "Username already exists." },
                { status: 409 }
            );
        }

        user.username = username.toLowerCase();
    }
    if (profilePic) {
        user.profilepic = profilePic;
    }
    try {
        await user.save();
        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Username already exists." },
                { status: 409 }
            );
        }

        throw error;
    }
}  