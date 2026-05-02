"use client";

import { UploadCloud, X, GripVertical } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductImageUploaderProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxSizeMB?: number;
}

export function ProductImageUploader({
  value,
  onChange,
  maxSizeMB = 5,
}: ProductImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // We need to keep track of preview URLs to avoid memory leaks and re-rendering issues
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    // Generate object URLs for the files
    const urls = value.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup function to revoke old URLs
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [value]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      const validFiles = newFiles.filter((file) => {
        if (!file.type.startsWith("image/")) {
          alert(`File ${file.name} is not an image.`);
          return false;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`File ${file.name} is too large. Max size is ${maxSizeMB}MB.`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        onChange([...value, ...validFiles]);
      }
      
      // Reset input value to allow selecting the same file again if it was deleted
      if (inputRef.current) inputRef.current.value = "";
    },
    [maxSizeMB, onChange, value],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const newFiles = Array.from(e.dataTransfer.files || []);
      const validFiles = newFiles.filter((file) => {
        if (!file.type.startsWith("image/")) {
          alert(`File ${file.name} is not an image.`);
          return false;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`File ${file.name} is too large. Max size is ${maxSizeMB}MB.`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        onChange([...value, ...validFiles]);
      }
    },
    [maxSizeMB, onChange, value],
  );

  const removeFile = (indexToRemove: number) => {
    const newFiles = [...value];
    newFiles.splice(indexToRemove, 1);
    onChange(newFiles);
  };

  // Simple move up/down for reordering
  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newFiles = [...value];
      const temp = newFiles[index - 1];
      newFiles[index - 1] = newFiles[index];
      newFiles[index] = temp;
      onChange(newFiles);
    } else if (direction === 'down' && index < value.length - 1) {
      const newFiles = [...value];
      const temp = newFiles[index + 1];
      newFiles[index + 1] = newFiles[index];
      newFiles[index] = temp;
      onChange(newFiles);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Grid of existing images */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((file, index) => (
            <div 
              key={`${file.name}-${index}`} 
              className="group relative aspect-square overflow-hidden rounded-xl border bg-muted/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrls[index]}
                alt={file.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge variant="default" className="shadow-md">Primary</Badge>
                </div>
              )}

              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 flex flex-col items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="rounded-full bg-destructive p-2 text-destructive-foreground shadow-sm transition-transform hover:scale-110"
                  title="Remove image"
                >
                  <X className="size-4" />
                </button>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveFile(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 transition-colors"
                    title="Move up / Make Primary"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFile(index, 'down')}
                    disabled={index === value.length - 1}
                    className="p-1.5 rounded bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 transition-colors"
                    title="Move down"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
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
          <div className="rounded-full bg-muted p-3 transition-colors group-hover:bg-background shadow-sm">
            <UploadCloud className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
          <div className="font-medium">
            {value.length > 0 ? "Add more images" : "Upload product images"}
          </div>
          <div className="text-muted-foreground text-xs">
            Drag & drop or click to select multiple. The first image will be the primary cover.
          </div>
        </div>
      </div>
    </div>
  );
}
