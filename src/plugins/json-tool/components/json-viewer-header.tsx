import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ViewMode, CodeLanguage } from '@/plugins/json-tool/json-tool';
import { TableIcon, Network, Code2, Type, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewerHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  codeLanguage: CodeLanguage;
  setCodeLanguage: (language: CodeLanguage) => void;
}

const viewModeIcons: Record<ViewMode, React.ReactNode> = {
  editor: <Code2 className="h-4 w-4" />,
  tree: <Network className="h-4 w-4" />,
  table: <TableIcon className="h-4 w-4" />,
  type: <Type className="h-4 w-4" />,
};

const viewModeLabels: Record<ViewMode, string> = {
  editor: '编辑器',
  tree: '树',
  table: '表',
  type: '代码类型',
};

const viewModeColors: Record<ViewMode, string> = {
  tree: 'bg-green-600 text-white border-green-300 hover:bg-green-700',
  editor: 'bg-blue-600 text-white border-blue-300 hover:bg-blue-700',
  table: 'bg-yellow-500 text-white border-yellow-300 hover:bg-yellow-600',
  type: 'bg-purple-600 text-white border-purple-300 hover:bg-purple-700',
};

const codeLanguageLabels: Record<CodeLanguage, string> = {
  typescript: 'TypeScript',
  go: 'Go',
  rust: 'Rust',
  python: 'Python',
  java: 'Java',
  csharp: 'C#',
  cpp: 'C++',
  swift: 'Swift',
  kotlin: 'Kotlin',
  objc: 'Objective-C',
};

const codeLanguageIcons: Record<CodeLanguage, string> = {
  typescript: 'TS',
  go: 'Go',
  rust: 'Rs',
  python: 'Py',
  java: 'Java',
  csharp: 'C#',
  cpp: 'C++',
  swift: 'Sw',
  kotlin: 'Kt',
  objc: 'ObjC',
};

export function JsonViewerHeader({ viewMode, setViewMode, codeLanguage, setCodeLanguage }: ViewerHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 py-2 px-4 dark:border-gray-700">
      <div className="flex items-center gap-1">
        {(['tree', 'editor', 'table', 'type'] as ViewMode[]).map((mode) => (
          <Button
            key={mode}
            size="sm"
            onClick={() => setViewMode(mode)}
            className={cn(
              'h-7 gap-1.5 px-2.5 text-xs border',
              viewMode === mode
                ? viewModeColors[mode]
                : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300',
            )}
          >
            {viewModeIcons[mode]}
            <span className="hidden sm:inline">{viewModeLabels[mode]}</span>
          </Button>
        ))}
      </div>

      {viewMode === 'type' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1.5 px-2.5 text-xs border bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200"
            >
              <span className="font-semibold">{codeLanguageIcons[codeLanguage]}</span>
              <span className="hidden sm:inline">{codeLanguageLabels[codeLanguage]}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[140px]">
            {(Object.keys(codeLanguageLabels) as CodeLanguage[]).map((lang) => (
              <DropdownMenuItem
                key={lang}
                onClick={() => setCodeLanguage(lang)}
                className={cn(
                  'cursor-pointer',
                  codeLanguage === lang && 'bg-accent'
                )}
              >
                <span className="font-semibold mr-2">{codeLanguageIcons[lang]}</span>
                {codeLanguageLabels[lang]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
