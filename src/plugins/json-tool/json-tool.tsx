import { useState, useCallback, useEffect, useRef } from 'react';
// import { Header } from './components/header';
import '@/lib/monaco-setup';
import { JsonEditor } from './components/json-editor';
import { JsonViewer } from './components/json-viewer';
import { HistorySidebar } from './components/history-sidebar';
import { useJsonHistory } from './hooks/use-json-history';
import type { HistoryItem } from './model/history-item';

export type ViewMode = 'editor' | 'tree' | 'table' | 'type';
export type IndentSize = 1 | 2 | 3 | 4 | 'tab';
export type CodeLanguage =
  | 'typescript'
  | 'go'
  | 'rust'
  | 'python'
  | 'java'
  | 'csharp'
  | 'cpp'
  | 'swift'
  | 'kotlin'
  | 'objc';

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
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [indentSize, setIndentSize] = useState<IndentSize>(2);
  const [showHistory, setShowHistory] = useState(false);
  const [isEscape, setIsEscape] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>('typescript');
  const isManualEditRef = useRef(false);
  const { history, addToHistory, clearHistory, deleteHistoryItem, loadFromHistory } =
    useJsonHistory();

  const [parsedJson, setParesedJson] = useState<unknown>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const parseJson = useCallback((input: string, escape: boolean) => {
    // 检查空输入或纯空白
    const trimmed = input.trim();
    if (!trimmed) {
      setParesedJson(null);
      setParseError(null);
      return { success: true, data: null };
    }

    try {
      // 如果是转义状态，先取消转义再解析
      let parseInput = input;
      if (escape) {
        parseInput = input.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }
      const parsed = JSON.parse(parseInput);
      setParesedJson(parsed);
      setParseError(null);
      return { success: true, data: parsed };
    } catch (error) {
      const e = error as Error;
      setParesedJson(null);
      setParseError(e.message);
      return { success: false, error: e.message };
    }
  }, []);

  // 检测内容是否包含转义字符
  const detectEscapeState = useCallback((input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return false;

    // 检测是否包含转义模式的字符串
    // 转义的 JSON 通常包含 \" 序列
    const hasEscapedQuotes = /\\"/.test(trimmed);
    // 检查是否以转义的 JSON 开始（如 "{\"key":
    const startsWithEscaped = /^{\s*\\"/.test(trimmed) || /^\[\s*\\"/.test(trimmed);

    return hasEscapedQuotes || startsWithEscaped;
  }, []);

  useEffect(() => {
    parseJson(jsonInput, isEscape);
  }, [jsonInput, isEscape, parseJson]);

  // 当内容变化时自动检测转义状态
  useEffect(() => {
    // 只在手动编辑时检测，避免与按钮操作冲突
    if (!isManualEditRef.current) return;

    const shouldEscape = detectEscapeState(jsonInput);
    if (shouldEscape !== isEscape) {
      setIsEscape(shouldEscape);
    }
    isManualEditRef.current = false;
  }, [jsonInput, detectEscapeState, isEscape]);

  const handleFormat = useCallback(() => {
    const result = parseJson(jsonInput, isEscape);
    if (result.success) {
      const indent = indentSize == 'tab' ? '\t' : indentSize;
      const formatted = JSON.stringify(result.data, null, indent);
      setJsonInput(formatted);
      setIsEscape(false); // 格式化后退出转义状态
      addToHistory(formatted);
    }
  }, [jsonInput, indentSize, parseJson, addToHistory, isEscape]);

  const handleMinify = useCallback(() => {
    const result = parseJson(jsonInput, isEscape);
    if (result.success) {
      const minified = JSON.stringify(result.data);
      setJsonInput(minified);
      setIsEscape(false); // 压缩后退出转义状态
    }
  }, [jsonInput, parseJson, isEscape]);

  const handleEscape = useCallback(() => {
    const escaped = jsonInput.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    setJsonInput(escaped);
    setIsEscape(true);
  }, [jsonInput]);

  const handleUnescape = useCallback(() => {
    const unescaped = jsonInput.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    setJsonInput(unescaped);
    setIsEscape(false);
  }, [jsonInput]);

  const handleEscapeToggle = useCallback(() => {
    if (isEscape) {
      handleUnescape();
    } else {
      handleEscape();
    }
  }, [isEscape, handleEscape, handleUnescape]);

  const handleClear = useCallback(() => {
    setJsonInput('');
    setParesedJson(null);
    setParseError(null);
  }, []);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(jsonInput);
  }, [jsonInput]);

  // const handleDownload = useCallback(() => {
  //   const blob = new Blob([jsonInput], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'data.json';
  //   document.body.append(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // }, [jsonInput]);

  // const handleUpload = useCallback(
  //   (content: string) => {
  //     setJsonInput(content);
  //     setIsEscape(false); // 上传新内容时重置转义状态
  //     const result = parseJson(content, false);
  //     if (result.success) {
  //       addToHistory(content);
  //     }
  //   },
  //   [parseJson, addToHistory],
  // );

  const handleLoadFromHistory = useCallback(
    (item: HistoryItem) => {
      loadFromHistory(item);
      setJsonInput(item.content);
    },
    [loadFromHistory],
  );

  // 处理编辑器内容变化
  const handleEditorChange = useCallback((value: string) => {
    isManualEditRef.current = true;
    setJsonInput(value);
  }, []);

  // 处理树视图节点删除
  const handleTreeNodeDelete = useCallback(
    (newData: unknown) => {
      const formatted = JSON.stringify(newData, null, indentSize === 'tab' ? '\t' : indentSize);
      setJsonInput(formatted);
      addToHistory(formatted);
    },
    [indentSize, addToHistory],
  );

  return (
    <div className="flex h-[calc(100vh-353px)] flex-col bg-background">
      {/* <Header
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
      /> */}
      <div className="flex h-[calc(100vh-340px)] flex-1 overflow-hidde">
        {showHistory && (
          <HistorySidebar
            history={history}
            onSelect={handleLoadFromHistory}
            onDelete={deleteHistoryItem}
            onClear={clearHistory}
            onClose={() => setShowHistory(false)}
          />
        )}
        <div className="flex flex-1 gap-0 divide-x divide-gray-200 overflow-hidden dark:divide-gray-700">
          <div className="flex-1 overflow-hidden">
            <JsonEditor
              value={jsonInput}
              indentSize={indentSize}
              setIndentSize={setIndentSize}
              onFormat={handleFormat}
              onMinify={handleMinify}
              onClear={handleClear}
              onCopy={handleCopy}
              isEscape={isEscape}
              onEscapeToggle={handleEscapeToggle}
              onChange={handleEditorChange}
              error={parseError}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <JsonViewer
              data={parsedJson}
              error={parseError}
              viewMode={viewMode}
              setViewMode={setViewMode}
              indentSize={indentSize}
              onDataChange={handleTreeNodeDelete}
              codeLanguage={codeLanguage}
              setCodeLanguage={setCodeLanguage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
