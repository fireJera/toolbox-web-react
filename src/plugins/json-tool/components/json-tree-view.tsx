import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JsonTreeViewProps {
  data: unknown;
}

interface TreeNodeProps {
  label: string | number;
  value: number;
  isLast: boolean;
}

function getValueType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function getValuePreview(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    return value.length > 50 ? `"${value.substring(0, 50)}..."` : `"${value}"`;
  }
  if (Array.isArray(value)) return `Array(${value.length})`;
  if (typeof value === 'object') {
    const keys = Object.keys(value as object);
    return `{${keys.length} ${keys.length === 1 ? 'key' : 'keys'}}`;
  }
  return String(value);
}

function TreeNode({ label, value, level, isLast }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const valueType = getValueType(value);
  const isExpandable = valueType === 'object' || valueType === 'array';

  const hasChildren =
    isExpandable &&
    value !== null &&
    (Array.isArray(value) ? value.length > 0 : Object.keys(value as object).length > 0);

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-1 rounded px-1 py-0.5 hover:bg-accent/50',
          hasChildren && 'cursor-pointer',
        )}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        style={{ paddingLeft: `${level * 16}px` }}
      >
        {hasChildren ? (
          <span className="flex h-4 w-4 items-center justify-center text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </span>
        ) : (
          <span className="h-4 w-4" />
        )}
        <span className="text-json-key font-medium">
          {typeof label === 'string' ? label : `[${label}]`}:
        </span>
        <span className="text-muted-foreground">:</span>
        {!hasChildren || !isExpanded ? (
          <span
            className={cn(
              'ml-1',
              valueType === 'string'
                ? 'text-json-string'
                : valueType === 'number'
                ? 'text-json-number'
                : valueType === 'boolean'
                ? 'text-json-boolean'
                : valueType === 'null'
                ? 'text-json-null'
                : (valueType === 'object' || valueType === 'array') && 'text-muted-foreground',
            )}
          >
            {getValuePreview(value)}
          </span>
        ) : null}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {Array.isArray(value)
            ? value.map((item, index) => (
                <TreeNode
                  key={index}
                  label={index}
                  value={item}
                  level={level + 1}
                  isLast={index === value.length - 1}
                />
              ))
            : Object.entries(value as Record<string, unknown>).map(([key, val], index, arr) => (
                <TreeNode
                  key={key}
                  label={key}
                  value={val}
                  level={level + 1}
                  isLast={index === arr.length - 1}
                />
              ))}
        </div>
      )}
    </div>
  );
}

export function JsonTreeView({ data }: JsonTreeViewProps) {
  return (
    <div className="h-full overflow-auto bg-card p-4 font-mono text-sm  ">
      {Array.isArray(data) ? (
        data.map((item, index) => (
          <TreeNode
            key={index}
            label={index}
            value={item}
            level={0}
            isLast={index === data.length - 1}
          />
        ))
      ) : typeof data === 'object' && data !== null ? (
        Object.entries(data as Record<string, unknown>).map(([key, value], index, arr) => (
          <TreeNode
            key={key}
            label={key}
            value={value}
            level={0}
            isLast={index === arr.length - 1}
          />
        ))
      ) : (
        <span
          className={cn(
            typeof data === 'string' && 'text-json-string',
            typeof data === 'number' && 'text-json-number',
            typeof data === 'boolean' && 'text-json-boolean',
            data === null && 'text-json-null',
          )}
        >
          {JSON.stringify(data)}
        </span>
      )}
    </div>
  );
}
