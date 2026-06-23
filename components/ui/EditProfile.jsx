"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
   
  }
  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Edit Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Edit Profile Picture URL"
        onChange={(e) => setProfilePic(e.target.value)}
      />
      <Button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover: cursor-alias" onClick={handleUpdateProfile}>
        Update Profile
      </Button>
    </div>
  );
};