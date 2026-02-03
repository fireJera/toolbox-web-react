import { useState } from 'react';
import { ChevronRight, ChevronDown, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface JsonTreeViewProps {
  data: unknown;
  onDataChange?: (data: unknown) => void;
}

interface TreeNodeProps {
  label: string | number;
  value: unknown;
  level: number;
  isLast: boolean;
  path: (string | number)[];
  onDelete: (path: (string | number)[]) => void;
  hoveredPath: (string | number)[];
  setHoveredPath: (path: (string | number)[]) => void;
}

// 判断 path1 是否是 path2 的祖先或自己
function isAncestorOrSelf(path1: (string | number)[], path2: (string | number)[]): boolean {
  if (path1.length > path2.length) return false;
  for (let i = 0; i < path1.length; i++) {
    if (path1[i] !== path2[i]) return false;
  }
  return true;
}

function getValueType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function formatPrimitiveValue(value: unknown): { text: string; className: string } {
  if (value === null) return { text: 'null', className: 'text-json-null' };
  if (typeof value === 'boolean') return { text: String(value), className: 'text-json-boolean' };
  if (typeof value === 'number') return { text: String(value), className: 'text-json-number' };
  if (typeof value === 'string') {
    const display = value.length > 50 ? `"${value.substring(0, 50)}..."` : `"${value}"`;
    return { text: display, className: 'text-json-string' };
  }
  return { text: String(value), className: '' };
}

function TreeNode({ label, value, level, isLast, path, onDelete, hoveredPath, setHoveredPath }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const valueType = getValueType(value);
  const isExpandable = valueType === 'object' || valueType === 'array';

  const children = isExpandable && value !== null ? (
    Array.isArray(value) ? value : Object.entries(value as Record<string, unknown>)
  ) : null;
  const hasChildren = children && (Array.isArray(children) ? children.length > 0 : false);

  const bracketOpen = valueType === 'array' ? '[' : '{';
  const bracketClose = valueType === 'array' ? ']' : '}';
  const isEmpty = !hasChildren;

  // 判断当前节点是否应该显示删除按钮
  const showDeleteButton = isAncestorOrSelf(path, hoveredPath);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(path);
  };

  const handleMouseEnter = () => {
    setHoveredPath(path);
  };

  const handleMouseLeave = () => {
    setHoveredPath([]);
  };

  return (
    <div className="select-none">
      {/* 键名行 */}
      <div
        className={cn(
          'flex items-center gap-1 rounded px-1 py-0.5 hover:bg-accent/50',
          hasChildren && 'cursor-pointer',
        )}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ paddingLeft: `${level * 16}px` }}
      >
        {hasChildren ? (
          <span className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </span>
        ) : (
          <span className="h-4 w-4 shrink-0" />
        )}
        <span className="text-json-key font-medium">
          {typeof label === 'string' ? label : `[${label}]`}
        </span>
        <span className="text-muted-foreground">:</span>
        {isExpandable ? (
          <span className="text-muted-foreground">
            {isEmpty ? (
              <span>
                {bracketOpen}
                {bracketClose}
              </span>
            ) : isExpanded ? (
              bracketOpen
            ) : (
              <span className="italic opacity-70">
                {bracketOpen}
                ...{bracketClose}
              </span>
            )}
          </span>
        ) : (
          <span className={cn('ml-1', formatPrimitiveValue(value).className)}>
            {formatPrimitiveValue(value).text}
          </span>
        )}
        <span className={cn('ml-1', showDeleteButton ? 'opacity-100' : 'opacity-0')}>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </span>
      </div>

      {/* 子节点 */}
      {hasChildren && isExpanded && (
        <>
          {children.map((item, index) => {
            const isChildLast = index === (Array.isArray(children) ? children.length - 1 : 0);
            if (Array.isArray(value)) {
              return (
                <TreeNode
                  key={index}
                  label={index}
                  value={item}
                  level={level + 1}
                  isLast={isChildLast}
                  path={[...path, index]}
                  onDelete={onDelete}
                  hoveredPath={hoveredPath}
                  setHoveredPath={setHoveredPath}
                />
              );
            } else {
              const [key, val] = item as [string, unknown];
              return (
                <TreeNode
                  key={key}
                  label={key}
                  value={val}
                  level={level + 1}
                  isLast={isChildLast}
                  path={[...path, key]}
                  onDelete={onDelete}
                  hoveredPath={hoveredPath}
                  setHoveredPath={setHoveredPath}
                />
              );
            }
          })}
          {/* 闭括号 */}
          <div
            className="px-1 py-0.5 text-muted-foreground"
            style={{ paddingLeft: `${level * 16}px` }}
          >
            {bracketClose}
            {isLast ? '' : ','}
          </div>
        </>
      )}
    </div>
  );
}

export function JsonTreeView({ data, onDataChange }: JsonTreeViewProps) {
  const [isRootExpanded, setIsRootExpanded] = useState(true);
  const [hoveredPath, setHoveredPath] = useState<(string | number)[]>([]);
  const valueType = getValueType(data);
  const isExpandable = valueType === 'object' || valueType === 'array';

  const children = isExpandable && data !== null ? (
    Array.isArray(data) ? data : Object.entries(data as Record<string, unknown>)
  ) : null;
  const hasChildren = children && (Array.isArray(children) ? children.length > 0 : false);

  const bracketOpen = valueType === 'array' ? '[' : '{';
  const bracketClose = valueType === 'array' ? ']' : '}';

  // 根据路径删除节点
  const handleDelete = (path: (string | number)[]) => {
    if (path.length === 0) return;

    const newData = JSON.parse(JSON.stringify(data)); // 深拷贝
    let current: any = newData;

    // 遍历到倒数第二层
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }

    const lastKey = path[path.length - 1];

    if (Array.isArray(current)) {
      current.splice(lastKey as number, 1);
    } else {
      delete current[lastKey];
    }

    onDataChange?.(newData);
  };

  return (
    <div className="h-full overflow-auto bg-card p-4 font-mono text-sm">
      {/* 根节点 */}
      {isExpandable && data !== null ? (
        <div>
          {/* 根节点标题行 */}
          <div
            className={cn(
              'flex items-center gap-1 rounded px-1 py-0.5 hover:bg-accent/50',
              hasChildren && 'cursor-pointer',
            )}
            onClick={() => hasChildren && setIsRootExpanded(!isRootExpanded)}
          >
            {hasChildren ? (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
                {isRootExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </span>
            ) : (
              <span className="h-4 w-4 shrink-0" />
            )}
            <span className="text-muted-foreground">
              {hasChildren ? (
                isRootExpanded ? (
                  bracketOpen
                ) : (
                  <span className="italic opacity-70">
                    {bracketOpen}
                    ...{bracketClose}
                  </span>
                )
              ) : (
                <span>
                  {bracketOpen}
                  {bracketClose}
                </span>
              )}
            </span>
          </div>

          {/* 根节点的子节点 */}
          {hasChildren && isRootExpanded && (
            <>
              {children.map((item, index) => {
                const isChildLast = index === (Array.isArray(children) ? children.length - 1 : 0);
                if (Array.isArray(data)) {
                  return (
                    <TreeNode
                      key={index}
                      label={index}
                      value={item}
                      level={1}
                      isLast={isChildLast}
                      path={[index]}
                      onDelete={handleDelete}
                      hoveredPath={hoveredPath}
                      setHoveredPath={setHoveredPath}
                    />
                  );
                } else {
                  const [key, val] = item as [string, unknown];
                  return (
                    <TreeNode
                      key={key}
                      label={key}
                      value={val}
                      level={1}
                      isLast={isChildLast}
                      path={[key]}
                      onDelete={handleDelete}
                      hoveredPath={hoveredPath}
                      setHoveredPath={setHoveredPath}
                    />
                  );
                }
              })}
              {/* 根节点闭括号 */}
              <div className="px-1 py-0.5 text-muted-foreground">{bracketClose}</div>
            </>
          )}
        </div>
      ) : (
        <span className={cn(formatPrimitiveValue(data).className)}>
          {formatPrimitiveValue(data).text}
        </span>
      )}
    </div>
  );
}
