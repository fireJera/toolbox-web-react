import { Button } from '@/components/ui/button';
import type { ViewMode } from '@/plugins/json-tool/json-tool';
import { TableIcon, Network, Code2, Type } from 'lucide-react';

interface ViewerHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
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
  type: 'Type',
};

export function JsonViewerHeader({ viewMode, setViewMode }: ViewerHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-1">
        {(['tree', 'editor', 'table', 'type'] as ViewMode[]).map((mode) => (
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
    </header>
  );
}
