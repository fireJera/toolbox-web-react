'use client';

import React from 'react';

import { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ViewMode, IndentSize } from '@/app/page';
import {
  FileJson,
  Download,
  Upload,
  Copy,
  Trash2,
  History,
  Minimize2,
  AlignLeft,
  TableIcon,
  Network,
  Code2,
  Type,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  indentSize: IndentSize;
  setIndentSize: (size: IndentSize) => void;
  onFormat: () => void;
  onMinify: () => void;
  onClear: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onUpload: (content: string) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  isValid: boolean;
}

const viewModeIcons: Record<ViewMode, React.ReactNode> = {
  editor: <Code2 className="h-4 w-4" />,
  tree: <Network className="h-4 w-4" />,
  table: <TableIcon className="h-4 w-4" />,
  type: <Type className="h-4 w-4" />,
};

const viewModeLabels: Record<ViewMode, string> = {
  editor: 'Editor',
  tree: 'Tree',
  table: 'Table',
  type: 'Type',
};

export function Header({
  viewMode,
  setViewMode,
  indentSize,
  setIndentSize,
  onFormat,
  onMinify,
  onClear,
  onCopy,
  onDownload,
  onUpload,
  showHistory,
  setShowHistory,
  isValid,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onUpload(content);
        };
        reader.readAsText(file);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [onUpload],
  );

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileJson className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">JSON Formatter</h1>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-1">
          {(['editor', 'tree', 'table', 'type'] as ViewMode[]).map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode(mode)}
              className="h-7 gap-1.5 px-2.5 text-xs"
            >
              {viewModeIcons[mode]}
              <span className="hidden sm:inline">{viewModeLabels[mode]}</span>
            </Button>
          ))}
        </div>

        <div className="flex h-6 items-center">
          {isValid ? (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Check className="h-3 w-3" />
              Valid
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <X className="h-3 w-3" />
              Invalid
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1 bg-transparent">
              <span className="text-xs">
                {indentSize === 'tab' ? 'Tab' : `${indentSize} Spaces`}
              </span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {([1, 2, 3, 4, 'tab'] as IndentSize[]).map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => setIndentSize(size)}
                className="flex items-center justify-between"
              >
                <span>{size === 'tab' ? 'Tab' : `${size} Space${size === 1 ? '' : 's'}`}</span>
                {indentSize === size && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-4 w-px bg-border" />

        <Button
          variant="outline"
          size="sm"
          onClick={onFormat}
          className="h-8 gap-1.5 bg-transparent"
        >
          <AlignLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Format</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onMinify}
          className="h-8 gap-1.5 bg-transparent"
        >
          <Minimize2 className="h-4 w-4" />
          <span className="hidden sm:inline">Minify</span>
        </Button>

        <div className="h-4 w-px bg-border" />

        <Button variant="outline" size="sm" onClick={onCopy} className="h-8 gap-1.5 bg-transparent">
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">Copy</span>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />

        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 gap-1.5"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          className="h-8 gap-1.5 bg-transparent"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="h-8 gap-1.5 bg-transparent"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Clear</span>
        </Button>

        <div className="h-4 w-px bg-border" />

        <Button
          variant={showHistory ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
          className="h-8 gap-1.5"
        >
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
        </Button>
      </div>
    </header>
  );
}
