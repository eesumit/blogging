"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setMediaUrl(URL.createObjectURL(selected));
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Please select a file first!");

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("caption", caption);
      formData.append("fileType", file.type.startsWith("video") ? "video" : "image"); // 👈 key line

      const res = await fetch("/api/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setMediaUrl(data.url);
    } catch (err:unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
    router.push("/profile");
  };

  const isVideo = file?.type.startsWith("video");

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-6 p-6">
      <h1 className="text-2xl font-bold">Create Post</h1>

      <form onSubmit={handleUpload} className="flex flex-col gap-4 w-full max-w-md shadow-xl p-5 border-2 border-gray-200 rounded-2xl">
      <label htmlFor="title" className="font-medium">Title : </label>
          <input
            id="title"
            type="text"
            value={title}
            placeholder="i.e. my first post"
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500 placeholder:italic placeholder:text-sm font-semibold"
          />
        <div className="flex flex-col gap-1">
          {mediaUrl && (
            <div className=" flex flex-col items-center">
              {isVideo ? (
                <video
                  controls
                  src={mediaUrl}
                  className="rounded-lg w-full max-h-[400px] object-contain"
                />
              ) : (
                <Image
                  src={mediaUrl}
                  width={450}
                  height={400}
                  alt="Uploaded preview"
                  className="rounded-lg object-cover"
                />
              )}
            </div>
          )}
          
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="caption" className="font-medium">Captions : </label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption..."
            className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="file" className="font-medium">Select Image or Video</label>
          <input
            id="file"
            type="file"
            accept="image/*,video/*"
            placeholder="Choose Video or Image"
            onChange={handleFileChange}
            className="cursor-pointer border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button type="submit" disabled={uploading} className="cursor-pointer">
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
