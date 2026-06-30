"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {toast} from "sonner";
import { useRouter } from "next/navigation";
export default function EditProfile({ userData }) {
  const [username, setUsername] = useState(userData.username);
  const [profilePic, setProfilePic] = useState(userData.image);
  const router = useRouter();
   async function handleUpdateProfile() {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, profilePic }),
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      if(response.status === 409){
        toast.error("Username already exists. Please choose a different one.");
        return;
      }
     const result = await response.json();
      if (result.message) {
      toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  }
  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Username</label>
        <Input
          type="text"
          placeholder="Edit Username"
          className="w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Profile Picture URL</label>
        <Input
          type="text"
          placeholder="Edit Profile Picture URL"
          className="w-full"
          value={profilePic}
          onChange={(e) => setProfilePic(e.target.value)}
          onBlur={(e) => {router.refresh()}}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.refresh();
            }
          }}
          minLength={3}
        />
      </div>
      <Button 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700" 
        onClick={handleUpdateProfile}
      >
        Update Profile
      </Button>
    </div>
  );
};