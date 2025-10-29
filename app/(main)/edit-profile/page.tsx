"use client";

import Image from "next/image";
import profilePic from "@/public/images/profile.jpg";
import { Button } from "@/components/ui/button";
import { TbPhotoEdit } from "react-icons/tb";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleUsernameCheck } from "@/lib/handleUsername";

export default function EditProfile() {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // 📸 1. CAMERA FUNCTION — open webcam
  const handleCamera = async () => {
    try {
      setCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setMessage("❌ Camera access denied: " + ((err as Error).message || "Unknown error"));
      setCameraOpen(false);
    }
  };

  // 🧩 Capture frame & stop camera
  const capturePhoto = () => {
    if (!videoRef.current) {
      console.error("Video element not ready");
      setMessage("❌ Video element not ready");
      return;
    }
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get 2d context");
        setMessage("❌ Failed to capture photo");
        return;
      }
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          console.log("Captured blob:", blob);
          setFile(new File([blob], "capture.jpg", { type: "image/jpeg" }));
        } else {
          console.error("Canvas toBlob returned null");
          setMessage("❌ Failed to capture photo");
        }
      }, "image/jpeg");
    } catch (err: unknown) {
      console.error("Error capturing photo:", err);
      setMessage("❌ Error capturing photo: " + ((err as Error).message || "Unknown error"));
    } finally {
      // stop stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCameraOpen(false);
    }
  };

  // 💻 2. FILE SELECTION FUNCTION — open file picker
  const handleFileSelect = () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        try {
          const fileOnLocal = (e.target as HTMLInputElement).files?.[0];
          if (fileOnLocal) {
            console.log("Selected file:", fileOnLocal);
            setFile(fileOnLocal);
          }
        } catch (err: unknown) {
          console.error("Error handling file selection:", err);
          setMessage("❌ Error selecting file: " + ((err as Error).message || "Unknown error"));
        }
      };
      input.click();
    } catch (err: unknown) {
      console.error("Error creating file input:", err);
      setMessage("❌ Error opening file picker: " + ((err as Error).message || "Unknown error"));
    }
  };

  // 🧠 3. HANDLE SUBMIT — only send non-empty fields
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError(null);

    try {
      const formData = new FormData();
      if (username.trim().length !== 0)
        formData.append("username", username);
      if (name.trim().length !== 0)
        formData.append("name", name);
      if (bio.trim().length !== 0)
        formData.append("bio", bio);
      if (file) formData.append("file", file);

      const res = await fetch("/api/edit-profile", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown server error" }));
        throw new Error(data?.error || "Failed to save changes");
      }

      setMessage("✅ Profile updated successfully!");
      router.push("/profile"); // refresh page to reflect new data
    } catch (err: unknown) {
      console.error("Submit error:", err);
      setMessage("❌ Failed to update profile: " + ((err as Error).message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // let debounceTimeout: NodeJS.Timeout;
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value;
      setUsername(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        try {
          handleUsernameCheck(value, setUsername, setError);
        } catch (err: unknown) {
          console.error("Error in username check:", err);
          setError("❌ Error checking username: " + ((err as Error).message || "Unknown error"));
        }
      }, 500);
    } catch (err: unknown) {
      console.error("Error in handleUsernameChange:", err);
      setError("❌ Error updating username: " + ((err as Error).message || "Unknown error"));
    }
  };

  const handleBlur = () => {
    try {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      handleUsernameCheck(username, setUsername, setError);
    } catch (err: unknown) {
      console.error("Error in handleBlur:", err);
      setError("❌ Error checking username: " + ((err as Error).message || "Unknown error"));
    }
  };

  return (
    <div className="min-w-full min-h-screen flex flex-col items-center justify-start pt-14 overflow-y-auto relative">
      <form
        className="flex flex-col items-start justify-center gap-3 px-5 mt-4"
        onSubmit={handleSubmit}
      >
        <div className="relative">
          <Image
            src={profilePic}
            alt="Profile"
            className="rounded-full object-cover h-40 w-40 border-4 border-gray-300"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-gray-400/10 hover:bg-gray-400 opacity-50 cursor-pointer flex">
                <TbPhotoEdit className="w-10 h-10" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem>
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer w-full"
                  onClick={handleCamera}
                >
                  Camera
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer w-full"
                  onClick={handleFileSelect}
                >
                  Computer
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="username"
          value={username}
          onChange={handleUsernameChange}
          onBlur={handleBlur}

          className="border p-2 rounded-md w-60"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded-md w-60"
        />

        <label htmlFor="bio">Bio</label>
        <input
          type="text"
          id="bio"
          placeholder="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border p-2 rounded-md w-60"
        />

        <Button type="submit" size={"sm"} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>

        {message && (
          <p className="text-sm mt-2 text-gray-700 text-center w-full">
            {message}
          </p>
        )}
      </form>

      {/* 🎥 Camera Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50">
          <video ref={videoRef} className="rounded-xl w-80 h-60 bg-black" />
          <div className="flex gap-4 mt-4">
            <Button onClick={capturePhoto}>Capture</Button>
            <Button
              variant="destructive"
              onClick={() => {
                try {
                  if (streamRef.current)
                    streamRef.current.getTracks().forEach((t) => t.stop());
                } catch (err: unknown) {
                  console.error("Error stopping stream:", err);
                } finally {
                  setCameraOpen(false);
                }
              }}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}