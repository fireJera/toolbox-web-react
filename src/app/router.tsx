import { createBrowserRouter } from 'react-router-dom';
import { toolRegistry } from '@/core/toolRegistry';
import '@/core/loadTools';
import App from '../App.tsx';
import { Home } from '@/pages/home/Home';

const plugins = toolRegistry.getAllTools().map((tool) => ({
  path: tool.meta.route,
  element: <tool.component />,
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
