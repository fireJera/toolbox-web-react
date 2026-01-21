import { useRef, useEffect, useState } from 'react';
import Editor, { type OnMount, type Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { AlertCircle, Loader2 } from 'lucide-react';
// import { useTheme } from 'next-themes';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

export function JsonEditor({ value, onChange, error }: JsonEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme('json-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'string.key.json', foreground: 'c4a7e7' },
        { token: 'string.value.json', foreground: 'a3d9a9' },
        { token: 'number', foreground: '7eb6ff' },
        { token: 'keyword', foreground: 'f5a97f' },
        { token: 'delimiter', foreground: '908caa' },
      ],
      color: {
        'editor.background': '#1e1e2e',
        'editor.foreground': '#cdd6f4',
        'editorLineNumber.foreground': '#585b70',
        'editorLineNumber.activeForeground': '#f5a97f',
        'editor.lineHighlightBackground': '#313244',
        'editor.selectionBackground': '#585b70',
        'editorCursor.foreground': '#f5a97f',
        'editorIndentGuide.background': '#585b70',
        'editorIndentGuide.activeBackground': '#f5a97f',
      },
    });
    // Define custom light theme
    monaco.editor.defineTheme('json-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'string.key.json', foreground: '6f42c1' },
        { token: 'string.value.json', foreground: '22863a' },
        { token: 'number', foreground: '005cc5' },
        { token: 'keyword', foreground: 'd73a49' },
        { token: 'delimiter', foreground: '6a737d' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#24292e',
        'editorLineNumber.foreground': '#a0a0a0',
        'editorLineNumber.activeForeground': '#24292e',
        'editor.lineHighlightBackground': '#f6f8fa',
        'editor.selectionBackground': '#c8e1ff',
        'editorCursor.foreground': '#24292e',
        'editorIndentGuide.background': '#f0f0f0',
        'editorIndentGuide.activeBackground': '#e0e0e0',
      },
    });

    monaco.editor.setTheme('json-light');

    editor.focus();
  };

  // useEffect(() => {
  //   if (monacoRef.current) {
  //     const theme = 'json-light'; // Replace with actual theme logic if needed
  //     monacoRef.current.editor.setTheme(theme);
  //   }
  // }, [/* theme */]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
        <span className="text-sm font-medium text-muted-foreground">Input</span>
        <span className="text-xs text-muted-foreground">
          {lineCount} line{lineCount !== 1 ? 's' : ''}
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 border-b border-red-200 bg-red-50 px-4 py-2 dark:border-red-900/50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
        </div>
      )}

      <div className="relative flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={value}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Geist Mono', monospace",
            lineHeight: 24,
            tabSize: 2,
            insertSpaces: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 4,
            renderLineHighlight: 'line',
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
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            acceptSuggestionOnEnter: 'off',
            tabCompletion: 'off',
            wordBasedSuggestions: 'off',
            parameterHints: { enabled: false },
            formatOnPaste: true,
            formatOnType: false,
            bracketPairColorization: { enabled: true },
            guides: {
              indentation: true,
              bracketPairs: true,
            },
          }}
        />
      </div>
    </div>
  );
}
// const { theme } = useTheme();
