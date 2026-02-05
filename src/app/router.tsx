import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { toolRegistry } from '@/core/toolRegistry';
import '@/core/loadTools';
import App from '../App.tsx';
import { Home } from '@/pages/home/Home';
import { Loader2 } from 'lucide-react';

const plugins = toolRegistry.getAllTools().map((tool) => ({
  path: tool.meta.route,
  element: (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <tool.component />
    </Suspense>
  ),
}));

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      ...plugins,
    ],
  },
];

export const router = createBrowserRouter(routes);
