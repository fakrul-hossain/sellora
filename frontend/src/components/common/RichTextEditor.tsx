'use client';

import React, { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Code, Eye, Edit3, Trash2 } from 'lucide-react';

export interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
}

export function RichTextEditor({
  value = '',
  onChange,
  label = 'Product Description',
  placeholder = 'Write detailed product specifications, highlights, and warranty information...',
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertTag = (prefix: string, suffix: string = '') => {
    onChange(`${value}${prefix}${suffix}`);
  };

  const wrapSelection = (tagOpen: string, tagClose: string) => {
    onChange(`${value} ${tagOpen}Text${tagClose} `);
  };

  return (
    <div className="space-y-2 font-sans text-xs">
      <div className="flex items-center justify-between">
        {label && <label className="block font-bold text-slate-700">{label}</label>}

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 rounded-lg font-extrabold text-[10px] flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'write' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Write & Format</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg font-extrabold text-[10px] flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {activeTab === 'write' ? (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
          {/* Rich Text Toolbar */}
          <div className="p-2 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => wrapSelection('<b>', '</b>')}
              title="Bold"
              className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection('<i>', '</i>')}
              title="Italic"
              className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={() => insertTag('<h3>', '</h3>')}
              title="Heading 1"
              className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => insertTag('<h4>', '</h4>')}
              title="Heading 2"
              className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={() => insertTag('\n• ')}
              title="Bulleted List"
              className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => insertTag('\n1. ')}
              title="Numbered List"
              className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection('<blockquote>', '</blockquote>')}
              title="Quote"
              className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection('<code>', '</code>')}
              title="Code Spec"
              className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
            </button>

            <div className="ml-auto">
              <button
                type="button"
                onClick={() => onChange('')}
                title="Clear All"
                className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            rows={6}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 focus:outline-none text-xs font-medium text-slate-800 resize-y"
          />
        </div>
      ) : (
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 min-h-[160px] prose prose-xs max-w-none text-slate-800">
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br />') }} />
          ) : (
            <span className="text-slate-400 italic">No description content written yet.</span>
          )}
        </div>
      )}
    </div>
  );
}
