'use client';

import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon, Loader2, Link as LinkIcon } from 'lucide-react';
import { ApiClient } from '@/lib/api-client';

export interface CloudinaryImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  placeholder?: string;
}

export function CloudinaryImageUploader({
  value = '',
  onChange,
  folder = 'general',
  label = 'Upload Image',
  placeholder = 'Click or drag an image file to upload',
}: CloudinaryImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    setIsUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      try {
        const res = await ApiClient.post<any>('/upload/image', {
          image: base64data,
          folder,
        });

        if (res?.url) {
          onChange(res.url);
        } else {
          setError('Failed to retrieve Cloudinary image URL');
        }
      } catch (err: any) {
        console.error('Cloudinary upload error:', err);
        setError(err.message || 'Image upload failed');
      } finally {
        setIsUploading(false);
      }
    };
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl) {
      onChange(manualUrl);
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2 font-sans text-xs">
      {label && <label className="block font-bold text-slate-700">{label}</label>}

      {value ? (
        <div className="relative group w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-2xs">
          <img src={value} alt="Uploaded Preview" className="w-full h-40 object-cover object-center" />

          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
            <label className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-extrabold text-[11px] cursor-pointer hover:bg-slate-100 transition-colors">
              <span>Change Image</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2 bg-white border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="truncate max-w-[200px]">{value}</span>
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <Check className="w-3 h-3" /> Cloudinary
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {!showUrlInput ? (
            <label className="border-2 border-dashed border-slate-200 hover:border-brand-primary/50 bg-slate-50/50 hover:bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-brand-primary">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="font-extrabold">Uploading to Cloudinary...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-2xl bg-brand-lightest text-brand-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-slate-800 text-xs">{placeholder}</span>
                  <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP, GIF up to 5MB</span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <form onSubmit={handleManualUrlSubmit} className="flex gap-2">
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-brand-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-primary text-white font-extrabold rounded-xl text-xs hover:bg-brand-primary-hover transition-colors"
              >
                Set URL
              </button>
            </form>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[10px] text-slate-500 hover:text-brand-primary font-bold flex items-center gap-1 cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showUrlInput ? 'Switch to File Upload' : 'Paste Direct Image URL'}</span>
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-[11px] font-bold text-rose-600">{error}</p>}
    </div>
  );
}
