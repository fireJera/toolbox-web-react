import { cn } from '@/lib/utils';
import type { IndentSize } from '@/app/page';

interface JsonTypeViewProps {
  data: unknown;
  indentSize: IndentSize;
}

function getTypeInfo(value: unknown): {
  type: string;
  info?: string;
  color: string;
} {
  if (value === null) {
    return { type: 'null', color: 'text-json-null' };
  }
  if (Array.isArray(value)) {
    const itemTypes = [...new Set(value.map((item) => getTypeInfo(item).type))];
    return {
      type: 'array',
      info: `(${value.length} items: ${itemTypes.length === 1 ? ` of ${itemTypes[0]}` : ''})`,
      color: 'text-muted-foreground',
    };
  }

  switch (typeof value) {
    case 'string':
      return { type: 'string', info: `${value.length} characters`, color: 'text-json-string' };
    case 'number':
      return { type: Number.isInteger(value) ? 'integer' : 'float', color: 'text-json-number' };
    case 'boolean':
      return { type: 'boolean', color: 'text-json-boolean' };
    case 'object':
      return {
        type: 'object',
        info: `(${Object.keys(value as object).length} keys)`,
        color: 'text-muted-foreground',
      };
    default:
      return { type: typeof value, color: 'text-foreground' };
  }
}

interface TypeNodeProps {
    label: string | number;
    value: unknown;
    level: number;
}

function TypeNode({ label, value, level }: TypeNodeProps) {
    const typeInfo = getTypeInfo(value);
    const isExpandable = (typeof value === 'object' && value !== null || Array.isArray(value));

    const hasChildren = isExpandable && (
        (Array.isArray(value) ? value.length > 0 : Object.keys(value as object).length > 0)
    );


    return (
        <div className='select-none'>
            <div className='flex items-center gap-2 rounded px-2 py-1 hover:bg-accent/50'
            style={{paddingLeft: `${level * 20 + 8}px`}}
            >
                <span className='text-json-key font-medium min-w-0 shrink-0'>
                    {typeof label === 'string' ? label : `[${label}]`}
                </span>
                <span className='text-muted-foreground'>:</span>
                <span className={cn('rounded-md border px-2 py-0.5 text-xs font-mono',
                     typeInfo.color,
                     "border-current/20 bg-current/5")}>
                    {typeInfo.type}
                </span>
                {typeInfo.info && (
                    <span className='text-xs text-muted-foreground'>
                        {typeInfo.info}
                    </span>
                ）}
            </div>
         {hasChildren && (
        <div>
          {Array.isArray(value)
            ? value.map((item, index) => (
                <TypeNode
                  key={index}
                  label={index}
                  value={item}
                  level={level + 1}
                />
              ))
            : Object.entries(value as Record<string, unknown>).map(
                ([key, val]) => (
                  <TypeNode
                    key={key}
                    label={key}
                    value={val}
                    level={level + 1}
                  />
                )
              )}
        </div>
      )}
    </div>
  )
}

export function JsonTypeView({ data, indentSize: _indentSize }: JsonTypeViewProps) {
  return (
    <div className="h-full overflow-auto bg-card p-4 font-mono text-sm">
      {Array.isArray(data) ? (
        <>
          <div className="mb-2 flex items-center gap-2 rounded bg-muted/50 px-3 py-2">
            <span className="font-semibold text-foreground">Root</span>
            <span className="rounded-md border border-current/20 bg-current/5 px-2 py-0.5 text-xs text-muted-foreground">
              array
            </span>
            <span className="text-xs text-muted-foreground">
              ({data.length} items)
            </span>
          </div>
          {data.map((item, index) => (
            <TypeNode key={index} label={index} value={item} level={0} />
          ))}
        </>
      ) : typeof data === "object" && data !== null ? (
        <>
          <div className="mb-2 flex items-center gap-2 rounded bg-muted/50 px-3 py-2">
            <span className="font-semibold text-foreground">Root</span>
            <span className="rounded-md border border-current/20 bg-current/5 px-2 py-0.5 text-xs text-muted-foreground">
              object
            </span>
            <span className="text-xs text-muted-foreground">
              ({Object.keys(data).length} keys)
            </span>
          </div>
          {Object.entries(data as Record<string, unknown>).map(([key, value]) => (
            <TypeNode key={key} label={key} value={value} level={0} />
          ))}
        </>
      ) : (
        <div className="flex items-center gap-2 rounded bg-muted/50 px-3 py-2">
          <span className="font-semibold text-foreground">Value</span>
          <span
            className={cn(
              "rounded-md border border-current/20 bg-current/5 px-2 py-0.5 text-xs",
              getTypeInfo(data).color
            )}
          >
            {getTypeInfo(data).type}
          </span>
          <span className="text-foreground">{JSON.stringify(data)}</span>
        </div>
      )}
    </div>
  )
}
