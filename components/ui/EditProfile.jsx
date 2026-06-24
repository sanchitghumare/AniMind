"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {toast} from "sonner";
export default function EditProfile({ userData }) {
  const [username, setUsername] = useState(userData.username);
  const [profilePic, setProfilePic] = useState(userData.image);
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
    <div className="flex flex-col gap-4 ">
      <Input
        type="text"
        placeholder="Edit Username"
        className="w-1/2"
        onChange={(e) => setUsername(e.target.value)}
        minLength={3}
      />
      <Input
        type="text"
        placeholder="Edit Profile Picture URL"
        className="w-1/2"
        onChange={(e) => setProfilePic(e.target.value)}
        minLength={3}
      />
      <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-1/2 u hover:bg-blue-700 hover: cursor-alias" onClick={handleUpdateProfile}>
        Update Profile
      </Button>
    </div>
  );
};