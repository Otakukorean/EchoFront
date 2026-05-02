"use client";

import { ImageIcon, UploadCloud, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface FileUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  defaultUrl?: string;
}

export function FileUpload({
  value,
  onChange,
  accept = "image/*",
  maxSizeMB = 5,
  label = "Upload an image",
  defaultUrl,
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate preview URL when file changes
  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(value);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [value]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`File is too large. Max size is ${maxSizeMB}MB.`);
          return;
        }
        onChange(file);
      }
    },
    [maxSizeMB, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          alert("Please upload an image file.");
          return;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`File is too large. Max size is ${maxSizeMB}MB.`);
          return;
        }
        onChange(file);
      }
    },
    [maxSizeMB, onChange],
  );

  return (
    <div className="w-full">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      {value && previewUrl ? (
        <div className="relative overflow-hidden rounded-xl border bg-muted/30 p-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity hover:opacity-100 flex items-center justify-center">
              <button
                type="button"
                onClick={() => onChange(null)}
                className="rounded-full bg-destructive p-2 text-destructive-foreground shadow-sm transition-transform hover:scale-105"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between px-2 text-xs text-muted-foreground">
            <span className="truncate max-w-[200px]">{value.name}</span>
            <span>{(value.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/10 py-10 transition-all hover:bg-muted/30",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
          )}
        >
          <div className="flex flex-col items-center gap-2 text-center text-sm">
            <div className="rounded-full bg-muted p-3 transition-colors group-hover:bg-background">
              <UploadCloud className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <div className="font-medium">{label}</div>
            <div className="text-muted-foreground text-xs">
              SVG, PNG, JPG or WEBP (max. {maxSizeMB}MB)
            </div>
          </div>
        </div>
      )}

      {/* Show the existing image below the input if there's no new file and defaultUrl is provided */}
      {!value && defaultUrl && (
        <div className="mt-4 flex flex-col gap-2">
          <span className="text-sm text-muted-foreground font-medium">Current Image:</span>
          <div className="relative overflow-hidden rounded-xl border bg-muted/30 p-2 w-full max-w-[240px]">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={defaultUrl}
                alt="Current"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
