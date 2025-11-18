import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { FileText, Save, RotateCcw, Copy, Check } from 'lucide-react';
import type { GeneratedFile } from '../types';

// Configure Monaco Editor worker
self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: string, label: string) {
    if (label === 'json') {
      return './json.worker.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return './css.worker.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return './html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.js';
    }
    return './editor.worker.js';
  },
};

interface CodeEditorProps {
  file: GeneratedFile | null;
  content: string;
  onChange: (content: string) => void;
}

export function CodeEditor({ file, content, onChange }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [originalContent, setOriginalContent] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get language from file extension
  const getLanguage = (filePath: string): string => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      json: 'json',
      html: 'html',
      css: 'css',
      scss: 'scss',
      md: 'markdown',
      sql: 'sql',
      py: 'python',
      yaml: 'yaml',
      yml: 'yaml',
      xml: 'xml',
      sh: 'shell',
      dockerfile: 'dockerfile',
      env: 'shell',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  useEffect(() => {
    if (editorRef.current && !monacoEditorRef.current) {
      // Create Monaco Editor instance
      const editor = monaco.editor.create(editorRef.current, {
        value: content || '// Select a file to edit...',
        language: file ? getLanguage(file.path) : 'typescript',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        fontFamily: 'Fira Code, Monaco, Consolas, monospace',
        fontLigatures: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        tabSize: 2,
        insertSpaces: true,
        folding: true,
        bracketPairColorization: { enabled: true },
        suggest: {
          showSnippets: true,
          showKeywords: true,
        },
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false,
        },
      });

      monacoEditorRef.current = editor;

      // Listen for content changes
      editor.onDidChangeModelContent(() => {
        const newContent = editor.getValue();
        onChange(newContent);
        setHasChanges(newContent !== originalContent);
      });
    }

    return () => {
      // Cleanup
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
        monacoEditorRef.current = null;
      }
    };
  }, []);

  // Update editor when file changes
  useEffect(() => {
    if (monacoEditorRef.current && file) {
      const language = getLanguage(file.path);
      const model = monacoEditorRef.current.getModel();

      if (model) {
        monaco.editor.setModelLanguage(model, language);
        monacoEditorRef.current.setValue(content);
        setOriginalContent(content);
        setHasChanges(false);
      }
    }
  }, [file, content]);

  const handleSave = () => {
    if (monacoEditorRef.current) {
      const currentContent = monacoEditorRef.current.getValue();
      setOriginalContent(currentContent);
      setHasChanges(false);
      onChange(currentContent);
    }
  };

  const handleReset = () => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.setValue(originalContent);
      setHasChanges(false);
    }
  };

  const handleCopy = async () => {
    if (monacoEditorRef.current) {
      const currentContent = monacoEditorRef.current.getValue();
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFormat = () => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-gray-400">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a file to start editing</p>
          <p className="text-sm mt-2 opacity-75">
            Choose a file from the file explorer on the left
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-gray-200 font-medium text-sm">{file.path}</span>
          {hasChanges && (
            <span className="px-2 py-0.5 bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs rounded-full">
              Modified
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFormat}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm transition-colors"
            title="Format Document (Shift+Alt+F)"
          >
            Format
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded transition-colors"
            title="Copy to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {hasChanges && (
            <>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm transition-colors"
                title="Reset Changes"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors font-medium"
                title="Save File (Ctrl+S)"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            </>
          )}
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div ref={editorRef} className="flex-1" />

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-1.5 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>
            Language: <span className="text-gray-200">{getLanguage(file.path)}</span>
          </span>
          <span>
            Lines: <span className="text-gray-200">{content.split('\n').length}</span>
          </span>
          <span>
            Size: <span className="text-gray-200">{(content.length / 1024).toFixed(2)} KB</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>LF</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
}
