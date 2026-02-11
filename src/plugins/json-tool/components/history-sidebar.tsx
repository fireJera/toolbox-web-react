'use client';

import { Button } from '@/components/ui/button';
import { X, Trash2, Clock } from 'lucide-react';
import type { HistoryItem } from '@/plugins/json-tool/model/history-item';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function HistorySidebar({
  history,
  onSelect,
  onDelete,
  onClear,
  onClose,
}: HistorySidebarProps) {
  return (
    <div className="flex h-full w-72 flex-col border-r border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">History</span>
        </div>
        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
            >
              Clear all
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No history yet</p>
            <p className="mt-1 text-xs text-muted-foreground/80">Formatted JSON will appear here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {history.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/50 hover:bg-accent/50"
              >
                <button onClick={() => onSelect(item)} className="w-full text-left">
                  <div className="mb-1 text-xs text-muted-foreground">
                    {formatTimestamp(item.timestamp)}
                  </div>
                  <div className="line-clamp-3 font-mono text-xs text-foreground">
                    {item.preview}
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="absolute right-2 top-2 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
