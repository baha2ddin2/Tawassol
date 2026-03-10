"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadFile, Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";

/**
 * Props:
 * - onFiles(files: File[]) => void
 * - maxFiles (default 5)
 * - maxSize (bytes, default 5MB)
 */
export default function StyledUploader({
  onFiles = () => {},
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024,
}) {
  const [files, setFiles] = useState([]); // { file, preview, sizeError }

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      const accepted = acceptedFiles.map((f) => {
        return {
          file: f,
          preview: URL.createObjectURL(f),
          sizeError: f.size > maxSize,
        };
      });

      // Keep up to maxFiles
      const next = [...files, ...accepted].slice(0, maxFiles);
      setFiles(next);
      onFiles(next.map((x) => x.file));
    },
    [files, maxFiles, maxSize, onFiles]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "image/*": [] ,"video":[]},
      maxSize,
      multiple: true,
    });

  // cleanup previews on unmount
  useEffect(() => {
    return () => files.forEach((f) => URL.revokeObjectURL(f.preview));
  }, [files]);

  function removeAt(index) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onFiles(next.map((x) => x.file));
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-2">
      <div
        {...getRootProps()}
        className={`
          relative w-full h-44 flex flex-col items-center justify-center 
          rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50 scale-[1.01]" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}
          ${isDragReject ? "border-red-500 bg-red-50" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center pt-2 pb-3 text-gray-500">
          <UploadFile
            className={`w-10 h-10 mb-3 ${isDragActive ? "text-blue-500" : "text-gray-400"}`}
          />
          <p className="mb-1 text-sm">
            <span className="font-semibold text-blue-600">Click to upload</span> or drag & drop
          </p>
          <p className="text-xs text-gray-400">PNG, JPG (MAX. 5MB each) — up to {maxFiles} files</p>
        </div>
      </div>

      {/* previews */}
      <div className="mt-3 w-full grid grid-cols-3 gap-2">
        {files.map((f, i) => (
          <div key={i} className="relative rounded-md overflow-hidden border">
            <img
              src={f.preview}
              alt={`preview-${i}`}
              className="w-full h-24 object-cover block"
            />
            {f.sizeError && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs p-1">
                Too large
              </div>
            )}

            <div className="absolute top-1 right-1">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(i);
                }}
                className="bg-white/80"
              >
                <Close fontSize="small" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}