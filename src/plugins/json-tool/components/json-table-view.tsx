import { React } from 'react';
import { cn } from '@/lib/utils';
interface JsonTableViewProps {
  data: unknown;
}

function getValueType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function renderValue(value: unknown): React.ReactNode {
  const valueType = getValueType(value);
  if (valueType === null) {
    return <span className="text-json-null">null</span>;
  }
  if (valueType === 'boolean') {
    return <span className="text-json-boolean">{String(value)}</span>;
  }
  if (valueType === 'number') {
    return <span className="text-json-number">{value}</span>;
  }
  if (valueType === 'string') {
    return <span className="text-json-string">"{value}"</span>;
  }
  if (Array.isArray(value)) {
    return <span className="text-muted-foreground">Array({value.length})</span>;
  }
  if (typeof value === 'object') {
    return (
      <span className="text-muted-foreground">
        {'Object{' + Object.keys(value as object).length + '}'}
      </span>
    );
  }
  return String(value);
}

interface TableProps {
  data: Record<string, unknown> | unknown[];
  level?: number;
}

function JsonTable({ data, level = 0 }: TableProps) {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-muted-foreground">Empty Array</span>;
    }

    const allObjects = data.every(
      (item) => typeof item === 'object' && item !== null && !Array.isArray(item),
    );

    if (allObjects) {
      const allKeys = Array.from(
        new Set(data.flatMap((item) => (item ? Object.keys(item as Record<string, unknown>) : []))),
      );

      return (
        <div className="overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border bg-muted px-3 py-2 text-left font-medium text-muted-foreground">
                  #
                </th>
                {allKeys.map((key) => (
                  <th
                    key={key}
                    className="border border-border bg-muted px-3 py-2 text-left font-medium text-json-key"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-accent/50">
                  <td className="border border-border px-3 py-2 text-muted-foreground">{index}</td>
                  {allKeys.map((key) => {
                    const value = (item as Record<string, unknown>)[key];
                    const type = getValueType(value);
                    const isNested = type === 'object' || type === 'array';
                    return (
                      <td
                        key={key}
                        className={cn('border border-border px-3 py-2', isNested && 'align-top')}
                      >
                        {isNested && value !== null && level < 2 ? (
                          <JsonTable
                            data={value as Record<string, unknown> | unknown[]}
                            level={level + 1}
                          />
                        ) : (
                          renderValue(value)
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-border bg-muted px-3 py-2 text-left font-medium text-muted-foreground">
                Index
              </th>
              <th className="border border-border bg-muted px-3 py-2 text-left font-medium text-muted-foreground">
                Value
              </th>
              <th className="border border-border bg-muted px-3 py-2 text-left font-medium text-muted-foreground">
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const type = getValueType(item);
              const isNested = type === 'object' || type === 'array';
              return (
                <tr key={index} className="hover:bg-accent/50">
                  <td className="border border-border px-3 py-2 text-muted-foreground">{index}</td>
                  <td className={cn('border border-border px-3 py-2', isNested && 'align-top')}>
                    {isNested && item !== null && level < 2 ? (
                      <JsonTable
                        data={item as Record<string, unknown> | unknown[]}
                        level={level + 1}
                      />
                    ) : (
                      renderValue(item)
                    )}
                  </td>
                  <td className="border border-border px-3 py-2 text-muted-foreground">{type}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  if (typeof data !== 'object' || data === null) {
    const entries = object.entries(data);

    if (entries.length === 0) {
      return <span className="text-muted-foreground">Empty Object</span>;
    }

    return (
      <div className="overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-border bg-muted px-3 py-2 text-left font-medium text-muted-foreground">
                Key
              </th>
              <th className="border border-border bg-muted px-3 py-2 text-left font-medium text-muted-foreground">
                Value
              </th>
              <th className="border border-border bg-muted px-3 py-2 text-left font-medium text-muted-foreground">
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, value]) => {
              const type = getValueType(value);
              const isNested = type === 'object' || type === 'array';
              return (
                <tr key={key} className="hover:bg-accent/50">
                  <td className="border border-border px-3 py-2 text-json-key font-medium">
                    {key}
                  </td>
                  <td className={cn('border border-border px-3 py-2', isNested && 'align-top')}>
                    {isNested && value !== null && level < 2 ? (
                      <JsonTable
                        data={value as Record<string, unknown> | unknown[]}
                        level={level + 1}
                      />
                    ) : (
                      renderValue(value)
                    )}
                  </td>
                  <td className="border border-border px-3 py-2 text-muted-foreground">{type}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  return <div className="p-4">{renderValue(data)}</div>;
}
export function JsonTableView({ data }: JsonTableViewProps) {
  return (
    <div className="h-full overflow-auto bg-card p-4">
      {typeof data === 'object' && data !== null ? (
        <JsonTable data={data as Record<string, unknown> | unknown[]} />
      ) : (
        <div className="flex items-center justify-center p-8">
          <span className="text-muted-foreground">
            Table view works best with objects and arrays
          </span>
        </div>
      )}
    </div>
  );
}
