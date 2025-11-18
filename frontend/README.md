# Ultimate App Builder - Frontend

Beautiful, modern web interface for the Ultimate App Builder platform.

## 🎨 Features

- **Visual Code Editor** - Monaco Editor integration (same as VS Code)
- **Live Preview** - Real-time preview with iframe and element inspector
- **File Explorer** - Interactive file tree navigation
- **Project Management** - Create, view, and manage projects
- **Real-time Updates** - WebSocket integration for live progress
- **Beautiful UI** - Modern gradient design with Tailwind CSS
- **Responsive** - Mobile-first design that works on all devices

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **React 18** - Latest React with hooks
- **TypeScript** - Type-safe code
- **Vite** - Ultra-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **React Router** - Client-side routing
- **Monaco Editor** - Professional code editor
- **Lucide Icons** - Beautiful icon library
- **React Hot Toast** - Toast notifications

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── CodeEditor.tsx
│   │   ├── FileExplorer.tsx
│   │   ├── Layout.tsx
│   │   ├── LivePreview.tsx
│   │   └── ProjectWizard.tsx
│   ├── pages/          # Page components
│   │   ├── HomePage.tsx
│   │   ├── CreateProjectPage.tsx
│   │   ├── ProjectDetailPage.tsx
│   │   └── ProjectsListPage.tsx
│   ├── services/       # API & WebSocket services
│   │   ├── api.ts
│   │   └── websocket.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎯 Key Components

### CodeEditor
Professional code editor with:
- Syntax highlighting
- Auto-completion
- Multi-language support
- Format on save
- Dark theme

### LivePreview
Real-time preview with:
- Responsive device views (Desktop, Tablet, Mobile)
- Element inspector mode
- Auto-refresh
- External link support

### FileExplorer
Interactive file tree with:
- Folder collapse/expand
- File type icons
- Search functionality
- Click to open files

### ProjectWizard
4-step wizard for project creation:
1. Template Selection
2. Feature Selection
3. Configuration
4. Review & Create

## 🔌 API Integration

The frontend communicates with the backend via:

- **REST API** - `/api/*` endpoints
- **WebSocket** - Real-time updates at `/ws`

Configuration in `.env`:
```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme.

### Fonts
Fonts are loaded from Google Fonts in `index.html`. Current fonts:
- **Inter** - Sans-serif for UI
- **Fira Code** - Monospace for code

## 📦 Build

Production build:
```bash
npm run build
```

Output in `dist/` directory, ready to deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting

## 🧪 Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Dev server with HMR
npm run dev
```

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📄 License

MIT
