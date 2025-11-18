import { useState, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  FileCode,
  FileJson,
  Image,
  Database,
  Settings,
} from 'lucide-react';
import type { GeneratedFile } from '../types';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  file?: GeneratedFile;
}

interface FileExplorerProps {
  files: GeneratedFile[];
  onFileSelect: (file: GeneratedFile) => void;
  selectedFile: GeneratedFile | null;
}

export function FileExplorer({ files, onFileSelect, selectedFile }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));

  // Build tree structure from flat file list
  const fileTree = useMemo(() => {
    const root: FileNode = {
      name: 'root',
      path: '',
      type: 'folder',
      children: [],
    };

    files.forEach((file) => {
      const parts = file.path.split('/').filter(Boolean);
      let current = root;

      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const path = parts.slice(0, index + 1).join('/');

        if (!current.children) {
          current.children = [];
        }

        let node = current.children.find((child) => child.name === part);

        if (!node) {
          node = {
            name: part,
            path,
            type: isLast ? 'file' : 'folder',
            children: isLast ? undefined : [],
            file: isLast ? file : undefined,
          };
          current.children.push(node);
        }

        current = node;
      });
    });

    // Sort: folders first, then files, alphabetically
    const sortNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    };

    const sortTree = (node: FileNode): FileNode => {
      if (node.children) {
        node.children = sortNodes(node.children.map(sortTree));
      }
      return node;
    };

    return sortTree(root);
  }, [files]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();

    if (fileName === 'package.json' || fileName === 'tsconfig.json') {
      return <Settings className="w-4 h-4 text-yellow-500" />;
    }

    switch (ext) {
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <FileCode className="w-4 h-4 text-blue-500" />;
      case 'json':
        return <FileJson className="w-4 h-4 text-yellow-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'gif':
        return <Image className="w-4 h-4 text-purple-500" />;
      case 'sql':
      case 'prisma':
        return <Database className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderNode = (node: FileNode, depth: number = 0): JSX.Element | null => {
    if (node.type === 'folder') {
      const isExpanded = expandedFolders.has(node.path || 'root');
      const isRoot = node.path === '';

      return (
        <div key={node.path || 'root'}>
          {!isRoot && (
            <button
              onClick={() => toggleFolder(node.path)}
              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-lg text-left group transition-colors"
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 text-blue-500" />
              )}
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {node.name}
              </span>
            </button>
          )}

          {isExpanded && node.children && (
            <div>
              {node.children.map((child) => renderNode(child, isRoot ? depth : depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // File node
    const isSelected = selectedFile?.path === node.file?.path;

    return (
      <button
        key={node.path}
        onClick={() => node.file && onFileSelect(node.file)}
        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all ${
          isSelected
            ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900 shadow-sm'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
        style={{ paddingLeft: `${depth * 12 + 32}px` }}
      >
        {getFileIcon(node.name)}
        <span
          className={`text-sm truncate ${
            isSelected ? 'font-semibold' : 'font-medium'
          }`}
        >
          {node.name}
        </span>
      </button>
    );
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No files generated yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 max-h-[600px] overflow-y-auto">
      {fileTree.children?.map((node) => renderNode(node, 0))}
    </div>
  );
}
