# Changelog

## [Unreleased] - 2026-02-05

### Changed commit id a3b528ec0cbc33735001284b5d26e92819a29bb4

- **Performance Optimization (Lazy Loading)**:

  - Refactored tool plugins (JSON Tool, Base64 Tool) to use `React.lazy` and `Suspense`.
  - Tools are now loaded on-demand when the route is accessed, significantly reducing the initial bundle size and speeding up the homepage load time.
  - Added a loading spinner (`Loader2`) fallback during tool transitions.

- **Monaco Editor Localization**:
  - Replaced CDN-based Monaco Editor (jsdelivr) with the local `monaco-editor` npm package.
  - Implemented a custom Monaco Environment configuration (`src/lib/monaco-setup.ts`) using Vite's web worker import syntax (`?worker`) to serve workers locally.
  - Moved Monaco initialization from the global `main.tsx` to the specific `json-tool.tsx` component. This ensures the heavy editor engine is only initialized when the JSON tool is actually used.

### Added

- Created `src/lib/monaco-setup.ts` to handle local Monaco worker configuration.

- **Intelligent Preloading**: commit id fbf3ab90188ed0defb7914392430398030b3006d
  - Added an automatic preload mechanism that fetches all tool resources 2 seconds after the homepage loads.
  - Implemented mouse-hover preloading on tool cards (`ToolCard.tsx`) to trigger resource fetching before the user clicks.

### Optimized

- **Monaco Loading Strategy**:
  - Implemented static import for `monaco-setup` within the JSON tool. This ensures Monaco resources are fetched in parallel with the tool's code when accessing the route, minimizing the "pop-in" effect of the editor.
  - Configured Vite `manualChunks` to separate `monaco-editor` into a dedicated cacheable bundle for optimal HTTP/2 loading.
