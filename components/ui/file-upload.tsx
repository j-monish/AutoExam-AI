"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle2, FileText } from "lucide-react";
import { useDropzone } from "react-dropzone";

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    if (onChange) onChange(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <input
        ref={fileInputRef}
        id="file-upload-handle"
        type="file"
        onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
        className="hidden"
      />

      <AnimatePresence mode="popLayout">
        {files.length === 0 ? (
          <motion.div
            key="dropzone"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={handleClick}
            className={cn(
              "relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center group",
              isDragActive
                ? "border-[#6C63FF]/50 bg-[#6C63FF]/[0.05]"
                : "border-white/[0.08] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.02]"
            )}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                  isDragActive
                    ? "bg-[#6C63FF]/20"
                    : "bg-white/[0.04] group-hover:bg-[#6C63FF]/10"
                )}
              >
                <Upload
                  className={cn(
                    "w-6 h-6 transition-colors duration-300",
                    isDragActive
                      ? "text-[#6C63FF]"
                      : "text-[#71717A] group-hover:text-[#6C63FF]"
                  )}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-[#F5F5F5]">
                  {isDragActive ? "Drop your file here" : "Upload PDF file"}
                </p>
                <p className="text-sm text-[#71717A] mt-1">
                  Drag & drop or click to browse
                </p>
              </div>
              <p className="text-xs text-[#71717A]/60">
                PDF documents up to 50MB
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-list"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <AnimatePresence>
              {files.map((file, idx) => (
                <motion.div
                  key={file.name + idx}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-[#6C63FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F5F5F5] truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#71717A]">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      <span className="text-[#71717A]/30">·</span>
                      <span className="text-xs text-[#71717A]">{file.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      aria-label="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              onClick={handleClick}
              className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.08] text-xs text-[#71717A] hover:text-[#B0B0B5] hover:border-white/[0.12] transition-all duration-200"
            >
              + Add another file
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
