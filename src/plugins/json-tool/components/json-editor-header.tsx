import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { IndentSize } from '@/plugins/json-tool/json-tool';
import {
  ChevronDown,
  Check,
  Copy,
  CheckCheck,
} from 'lucide-react';
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
    <header className="flex items-center justify-between">
      <div>
        <Button onClick={onFormat}>格式化</Button>
        <Button onClick={onMinify}>压缩</Button>
        <Button onClick={onEscapeToggle} variant={isEscape ? 'default' : 'outline'}>
          {isEscape ? '取消转义' : '转义'}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <span className="text-sx">{indentSize === 'tab' ? 'Tab' : `${indentSize}空格`}</span>
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
                <span>{size === 'tab' ? 'Tab' : `${size}空格`}</span>
                {indentSize === size && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <Button onClick={handleCopy} variant={copied ? 'default' : 'outline'}>
          {copied ? (
            <>
              <CheckCheck className="mr-1 h-4 w-4" />
              已复制
            </>
          ) : (
            <>
              <Copy className="mr-1 h-4 w-4" />
              复制
            </>
          )}
        </Button>
        <Button onClick={onClear}>清除</Button>
      </div>
    </header>
  );
}
