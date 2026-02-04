import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { IndentSize } from '@/plugins/json-tool/json-tool';
import { ChevronDown, Check, Copy, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
interface EditorHeaderProps {
  indentSize: IndentSize;
  setIndentSize: (size: IndentSize) => void;
  onFormat: () => void;
  onMinify: () => void;
  onClear: () => void;
  onCopy: () => void;
  isEscape: boolean;
  onEscapeToggle: () => void;
}

export function JsonEditorHeader({
  indentSize,
  setIndentSize,
  onFormat,
  onMinify,
  onClear,
  onCopy,
  isEscape,
  onEscapeToggle,
}: EditorHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <header className="flex items-center justify-between border-b border-gray-200 py-2 px-4 dark:border-gray-700">
      <div className="flex items-center gap-1">
        <Button
          onClick={onFormat}
          size="sm"
          className="h-7 px-2.5 text-xs bg-blue-600 text-white hover:bg-blue-700 border-blue-300"
        >
          格式化
        </Button>
        <Button
          onClick={onMinify}
          size="sm"
          className="h-7 px-2.5 text-xs bg-purple-600 text-white border-green-300 hover:bg-purple-700"
        >
          压缩
        </Button>
        <Button
          onClick={onEscapeToggle}
          size="sm"
          className={cn(
            'h-7 px-2.5 text-xs text-white border',
            isEscape
              ? 'bg-yellow-600 border-yellow-700 hover:bg-yellow-700'
              : 'bg-yellow-500 border-yellow-300 hover:bg-yellow-600',
          )}
        >
          {isEscape ? '取消转义' : '转义'}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="h-7 gap-1 px-2.5 text-xs bg-purple-600 text-white border-purple-300 hover:bg-purple-700"
            >
              <span className="text-xs">{indentSize === 'tab' ? 'Tab' : `${indentSize}空格`}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            {([1, 2, 3, 4, 'tab'] as IndentSize[]).map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => setIndentSize(size)}
                className="flex items-center justify-between"
              >
                <span>{size === 'tab' ? 'Tab' : `${size}空格`}</span>
                {indentSize === size && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={handleCopy}
          className={cn(
            'h-7 px-2.5 text-white border',
            copied
              ? 'bg-cyan-600 border-cyan-700 hover:bg-cyan-700'
              : 'bg-cyan-500 border-cyan-300 hover:bg-cyan-600',
          )}
        >
          {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button
          onClick={onClear}
          className="h-7 px-2.5 text-xs bg-red-600 text-white border-red-300 hover:bg-red-700"
        >
          清除
        </Button>
      </div>
    </header>
  );
}
