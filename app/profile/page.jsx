"use server";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import ConnectDb from "@/lib/mongodb";
import User from "@/models/user";
import Image from "next/image";
import EditProfile from "@/components/ui/EditProfile";
export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h1 className="text-4xl font-bold mb-4">You are not logged in</h1>
                <p className="text-lg">Please log in to view your profile.</p>
            </div>
        );
    }
    await ConnectDb();
    const user = await User.findOne({email: session.user.email});
    const userData = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        image: user.profilepic,
    };
    return (
        <div className="flex flex-col items-center bg-black text-white  min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">Profile Page</h1>
            <Image
                src={userData.image || "/default-profile.png"}
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full mb-4"
            />
            <p className="text-lg">Welcome, {userData.username}!</p>
            <p className="text-lg">Email: {userData.email}</p>
            <div className="flex flex-col gap-4 mt-4">
                <EditProfile userData={userData} />
            </div>
        </div>
    );
}