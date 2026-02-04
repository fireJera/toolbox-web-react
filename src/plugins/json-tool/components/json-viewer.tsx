'use client';

import { useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { AlertCircle, FileJson, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { ViewMode, IndentSize, CodeLanguage } from '@/plugins/json-tool/json-tool';
import { JsonTreeView } from './json-tree-view';
import { JsonTableView } from './json-table-view';
import { JsonTypeView } from './json-type-view';
import { JsonViewerHeader } from './json-viewer-header';
import '../json.css';

interface JsonViewerProps {
  data: unknown;
  error: string | null;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  indentSize: IndentSize;
  codeLanguage: CodeLanguage;
  setCodeLanguage: (language: CodeLanguage) => void;
  onDataChange?: (data: unknown) => void;
}

export function JsonViewer({ data, error, viewMode, setViewMode, indentSize, codeLanguage, setCodeLanguage, onDataChange }: JsonViewerProps) {
  const { resolvedTheme } = useTheme();

  const formattedJson = useMemo(() => {
    if (data === null || data === undefined) return '';
    try {
      const indent = indentSize === 'tab' ? '\t' : indentSize;
      return JSON.stringify(data, null, indent);
    } catch {
      return '';
    }
  }, [data, indentSize]);

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Invalid JSON</h3>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      );
    }

    if (data === null || data === undefined) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="rounded-full bg-muted p-3">
            <FileJson className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">No Data</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter valid JSON on the left to see the formatted output
            </p>
          </div>
        </div>
      );
    }

    switch (viewMode) {
      case 'tree':
        return <JsonTreeView key={JSON.stringify(data)} data={data} onDataChange={onDataChange} />;
      case 'table':
        return <JsonTableView data={data} />;
      case 'type':
        return <JsonTypeView data={data} indentSize={indentSize} codeLanguage={codeLanguage} />;
      case 'editor':
      default:
        return (
          <Editor
            height="100%"
            defaultLanguage="json"
            value={formattedJson}
            theme={resolvedTheme === 'dark' ? 'json-dark' : 'json-light'}
            loading={
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            }
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'consolas, menlo, monaco, "Ubuntu Mono", source-code-pro, monospace',
              lineHeight: 24,
              tabSize: indentSize === 'tab' ? 4 : indentSize,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 4,
              renderLineHighlight: 'all',
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                useShadows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              overviewRulerBorder: false,
              contextmenu: true,
              bracketPairColorization: { enabled: true },
              guides: {
                indentation: true,
                bracketPairs: true,
              },
            }}
          />
        );
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
        <span className="text-sm font-medium text-muted-foreground">
          Output ({viewMode.charAt(0).toUpperCase() + viewMode.slice(1)})
        </span>
      </div> */}
      <JsonViewerHeader viewMode={viewMode} setViewMode={setViewMode} codeLanguage={codeLanguage} setCodeLanguage={setCodeLanguage} />
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
}
