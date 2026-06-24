"use server";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import ConnectDb from "@/lib/mongodb";
import User from "@/models/user";
import Image from "next/image";
import EditProfile from "@/components/ui/EditProfile";
import Watchlist from "@/models/watchlist";
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
    const len=await Watchlist.countDocuments({userId:user._id});
    const recentlyAdded = await Watchlist.find({userId: user._id}).sort({createdAt: -1}).limit(5);
    return (
        <div className="grid md:grid-cols-[600px_1fr] gap-10 bg-black text-white  min-h-screen p-20">
            <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
            <Image
                src={userData.image || "/default-profile.png"}
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full mb-4"
            />
            <p className="text-lg"> {userData.username}</p>
            <p className="text-lg"> {userData.email}</p>
            <div className="flex flex-col gap-4 mt-4">
                <EditProfile userData={userData} />
            </div>
            </div>
            <div className="flex flex-col gap-4 mt-10">
                <h1 className="text-2xl font-bold">📚 Watchlist Stats</h1>
                <h2> Saved: {len}</h2>
                <h2>Recently Added:</h2>
                <ul className="list-disc pl-5">
                    {recentlyAdded.map((item) => (
                        <li key={item._id.toString()}>{item.title}</li>
                    ))}
                </ul>
                
            </div>
        </div>
    );
}