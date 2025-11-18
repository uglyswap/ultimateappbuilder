import { useState, useEffect, useRef } from 'react';
import {
  Monitor,
  Smartphone,
  Tablet,
  RotateCw,
  ExternalLink,
  Maximize2,
  MousePointer2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { Project } from '../types';

interface LivePreviewProps {
  url: string;
  project: Project;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface DeviceConfig {
  width: string;
  height: string;
  label: string;
  icon: JSX.Element;
}

const devices: Record<DeviceType, DeviceConfig> = {
  desktop: {
    width: '100%',
    height: '100%',
    label: 'Desktop',
    icon: <Monitor className="w-4 h-4" />,
  },
  tablet: {
    width: '768px',
    height: '1024px',
    label: 'Tablet',
    icon: <Tablet className="w-4 h-4" />,
  },
  mobile: {
    width: '375px',
    height: '667px',
    label: 'Mobile',
    icon: <Smartphone className="w-4 h-4" />,
  },
};

export function LivePreview({ url, project }: LivePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [inspectorMode, setInspectorMode] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [url]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);

    // Enable inspector mode functionality
    if (iframeRef.current && inspectorMode) {
      try {
        const iframeDoc = iframeRef.current.contentDocument;
        if (iframeDoc) {
          iframeDoc.addEventListener('click', handleElementClick);
          iframeDoc.addEventListener('mouseover', handleElementHover);
        }
      } catch (error) {
        console.warn('Cannot access iframe document (CORS):', error);
      }
    }
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleOpenExternal = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleElementClick = (e: MouseEvent) => {
    if (inspectorMode) {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      const selector = getElementSelector(target);
      setSelectedElement(selector);

      // Highlight selected element
      highlightElement(target);
    }
  };

  const handleElementHover = (e: MouseEvent) => {
    if (inspectorMode) {
      const target = e.target as HTMLElement;
      // Add hover outline
      target.style.outline = '2px solid rgba(59, 130, 246, 0.5)';
      target.style.outlineOffset = '2px';

      target.addEventListener('mouseout', () => {
        target.style.outline = '';
        target.style.outlineOffset = '';
      }, { once: true });
    }
  };

  const getElementSelector = (element: HTMLElement): string => {
    // Generate CSS selector for element
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className) {
      const classes = Array.from(element.classList).join('.');
      return `.${classes}`;
    }

    return element.tagName.toLowerCase();
  };

  const highlightElement = (element: HTMLElement) => {
    // Remove previous highlights
    const iframeDoc = iframeRef.current?.contentDocument;
    if (iframeDoc) {
      iframeDoc.querySelectorAll('[data-inspector-selected]').forEach((el) => {
        (el as HTMLElement).style.outline = '';
        el.removeAttribute('data-inspector-selected');
      });
    }

    // Add new highlight
    element.style.outline = '2px solid rgb(59, 130, 246)';
    element.style.outlineOffset = '2px';
    element.setAttribute('data-inspector-selected', 'true');
  };

  if (!url) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-2">No Preview Available</p>
          <p className="text-sm text-gray-500">
            Click the "Preview" button to start the development server
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Device Selector */}
          {Object.entries(devices).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setDevice(key as DeviceType)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                device === key
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={config.label}
            >
              {config.icon}
              <span className="hidden md:inline">{config.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* URL Display */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <span className="text-xs text-gray-500">Preview URL:</span>
            <span className="text-xs font-mono text-gray-700">{url}</span>
          </div>

          {/* Inspector Mode */}
          <button
            onClick={() => setInspectorMode(!inspectorMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              inspectorMode
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Inspector Mode - Click elements to select them"
          >
            <MousePointer2 className="w-4 h-4" />
            <span className="hidden md:inline">Inspector</span>
          </button>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            title="Refresh Preview"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Open in New Tab */}
          <button
            onClick={handleOpenExternal}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            title="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-6 overflow-auto">
        <div
          className="mx-auto bg-white rounded-lg shadow-2xl overflow-hidden relative"
          style={{
            width: devices[device].width,
            height: devices[device].height,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-600">Loading preview...</p>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-gray-900 font-medium mb-2">Failed to load preview</p>
                <p className="text-gray-600 text-sm mb-4">
                  Make sure the development server is running
                </p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-0"
            title="Live Preview"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />

          {inspectorMode && (
            <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white px-4 py-2 text-sm font-medium z-20">
              🔍 Inspector Mode Active - Click any element to inspect
            </div>
          )}
        </div>
      </div>

      {/* Inspector Panel */}
      {inspectorMode && selectedElement && (
        <div className="bg-white border-t border-gray-200 p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Selected Element</h3>
          <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs">
            <div className="text-gray-600">Selector:</div>
            <div className="text-blue-600 font-semibold mt-1">{selectedElement}</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Click on elements in the preview to select them. This feature helps you identify
            components for editing.
          </p>
        </div>
      )}
    </div>
  );
}
