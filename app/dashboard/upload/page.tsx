"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Uploading file:", file.name);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("File uploaded and processed successfully!");
      } else {
        setMessage(result.error || "An error occurred during upload.");
      }
    } catch (error) {
      setMessage("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Upload Document</h1>
      <div className="mb-4">
        <Input type="file" accept=".pdf" onChange={handleFileChange} />
      </div>
      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {message && (
        <Alert className="mt-4">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
