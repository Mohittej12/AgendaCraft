/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import mammoth from 'mammoth';

interface FileUploadProps {
  onContentExtracted: (content: string, fileName: string) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onContentExtracted, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError(null);
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    try {
      if (fileExtension === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        onContentExtracted(result.value, fileName);
      } else if (fileExtension === 'md' || fileExtension === 'txt' || fileExtension === 'markdown') {
        const text = await file.text();
        onContentExtracted(text, fileName);
      } else {
        setError('Unsupported format. Consult documentation.');
      }
    } catch (err) {
      console.error('File processing error:', err);
      setError('Import failure. Retry operation.');
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full">
      <motion.div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border border-ink/20 p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-500
          ${isDragging ? 'bg-ink text-paper border-ink' : 'bg-transparent text-ink hover:border-ink/60'}
          ${error ? 'border-ink/20 opacity-50' : ''}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          accept=".docx,.md,.markdown,.txt"
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 mb-6 animate-spin opacity-40" />
            <p className="text-[11px] uppercase tracking-[0.3em] font-bold">Synthesizing Content...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 border border-ink/10 flex items-center justify-center mb-8 rotate-45 group-hover:rotate-0 transition-transform">
              <Upload className="w-8 h-8 -rotate-45" />
            </div>
            <h3 className="text-2xl font-serif italic mb-4">
              Select Source File
            </h3>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 mb-8">
              Drag & Drop or Click to Upload
            </p>
            <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">
              <span className="flex items-center gap-2">
                <FileText className="w-3 h-3" /> .DOCX
              </span>
              <span className="flex items-center gap-2">
                <FileText className="w-3 h-3" /> Markdown
              </span>
            </div>
          </div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-8 left-0 text-[10px] uppercase tracking-[0.2em] font-bold text-red-800"
            >
              Error: {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
