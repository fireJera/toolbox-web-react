import { useState, useCallback, useEffect } from 'react';
import { Header } from './components/header';
import { JsonEditor } from './components/json-editor';
import { JsonViewer } from './components/json-viewer';
import { HistorySidebar } from './components/history-sidebar';
import { useJsonHistory } from './hooks/use-json-history';
import type { HistoryItem } from './model/history-item';

export type ViewMode = 'editor' | 'tree' | 'table' | 'type';
export type IndentSize = 1 | 2 | 3 | 4 | 'tab';

const sampleJson = `{
  "name": "JSON Formatter",
  "version": "1.0.0",
  "description": "A powerful JSON formatter and viewer",
  "features": [
    "Format JSON in real time",
    "Multiple viewing modes",
    "Dark and Light themes",
    "History support"
  ],
  "settings": {
    "indentSize": 2,
    "theme": "light"
  },
  "isActive": true,
  "count": 42
}`;

export default function JsonTool() {
  const [jsonInput, setJsonInput] = useState(sampleJson);
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [indentSize, setIndentSize] = useState<IndentSize>(2);
  const [showHistory, setShowHistory] = useState(false);
  const { history, addToHistory, clearHistory, deleteHistoryItem, loadFromHistory } =
    useJsonHistory();

  const [parsedJson, setParesedJson] = useState<unknown>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const parseJson = useCallback((input: string) => {
    try {
      const parsed = JSON.parse(input);
      setParesedJson(parsed);
      setParseError(null);
      return { success: true, data: parsed };
    } catch (error) {
      const e = error as Error;
      setParesedJson(null);
      setParseError(e);
      return { success: false, error: e.message };
    }
  }, []);

  useEffect(() => {
    parseJson(jsonInput);
  }, [jsonInput, parseJson]);

  const handleFormat = useCallback(() => {
    const result = parseJson(jsonInput);
    if (result.success) {
      const indent = indentSize == 'tab' ? '\t' : indentSize;
      const formatted = JSON.stringify(result.data, null, indent);
      setJsonInput(formatted);
      addToHistory(formatted);
    }
  }, [jsonInput, indentSize, parseJson, addToHistory]);

  const handleMinify = useCallback(() => {
    const result = parseJson(jsonInput);
    if (result.success) {
      const minified = JSON.stringify(result.data);
      setJsonInput(minified);
    }
  }, [jsonInput, parseJson]);

  const handleClear = useCallback(() => {
    setJsonInput('');
    setParesedJson(null);
    setParseError(null);
  }, []);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(jsonInput);
  }, [jsonInput]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([jsonInput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.append(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [jsonInput]);

  const handleUpload = useCallback(
    (content: string) => {
      setJsonInput(content);
      const result = parseJson(content);
      if (result.success) {
        addToHistory(content);
      }
    },
    [parseJson, addToHistory],
  );

  const handleLoadFromHistory = useCallback(
    (item: HistoryItem) => {
      loadFromHistory(item);
      setJsonInput(item.content);
    },
    [loadFromHistory],
  );

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        indentSize={indentSize}
        setIndentSize={setIndentSize}
        onFormat={handleFormat}
        onMinify={handleMinify}
        onClear={handleClear}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onUpload={handleUpload}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        isValid={parseError === null && jsonInput.trim() !== ''}
      />
      <div className="flex flex-1 overflow-hidde">
        {showHistory && (
          <HistorySidebar
            history={history}
            onSelect={handleLoadFromHistory}
            onDelete={deleteHistoryItem}
            onClear={clearHistory}
            onClose={() => setShowHistory(false)}
          />
        )}
        <div className="flex flex-1 gap-0 divide-x divide-border overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <JsonEditor value={jsonInput} onChange={setJsonInput} error={parseError} />
          </div>
          <div className="flex-1 overflow-hidden">
            <JsonViewer
              data={parsedJson}
              error={parseError}
              viewMode={viewMode}
              indentSize={indentSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
