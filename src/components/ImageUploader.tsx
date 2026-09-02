import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Trash2, Sparkles, Upload, AlertCircle, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  onAnalyzeImage: (base64: string, promptText?: string) => void;
  isLoading?: boolean;
  onClose?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onAnalyzeImage,
  isLoading = false,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [userNote, setUserNote] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setFileError(null);
    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setUserNote('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleAnalyze = () => {
    if (!selectedImage) return;
    onAnalyzeImage(selectedImage, userNote || 'Analyze this visible first-aid or safety condition and provide structured first-aid guidance.');
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span>Show SafeAid AI what happened</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Upload a photo of a minor wound, spill, or campus physical hazard for quick structured analysis.
          </p>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-file-input"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="camera-file-input"
      />

      {fileError && (
        <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {!selectedImage ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
            isDragOver
              ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30'
              : 'border-slate-200 dark:border-slate-800 hover:border-cyan-400 bg-slate-50/50 dark:bg-slate-900/40'
          }`}
        >
          <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
            Drag and drop an image here, or choose an option
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Supports JPG, PNG, WEBP up to 10MB
          </p>

          {/* Action buttons */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>📷 Take Photo</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <span>🖼 Upload Image</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image preview */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center max-h-[300px]">
            <img
              src={selectedImage}
              alt="Uploaded emergency or hazard context"
              className="w-full h-auto max-h-[280px] object-contain rounded-xl"
            />
            <button
              onClick={handleClear}
              className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-red-600 text-white transition-colors backdrop-blur-xs"
              title="Remove image"
              aria-label="Remove image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Optional context note input */}
          <input
            type="text"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="Add brief note (e.g. 'cut finger on lab beaker 5 mins ago')..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
          />

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Remove
            </button>
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-cyan-500/20 active:scale-98 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Image...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Situation</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Required image disclaimer */}
      <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
        <span>
          Image analysis is informational and may be inaccurate. For serious injuries, deep wounds, or chemical hazards, contact a qualified professional immediately.
        </span>
      </div>
    </div>
  );
};
