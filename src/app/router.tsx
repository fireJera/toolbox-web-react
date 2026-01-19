import { createBrowserRouter } from 'react-router-dom';
import { toolRegistry } from '@/core/toolRegistry';
import '@/core/loadTools';
import App from '../App.tsx';

const plugins = toolRegistry.getAllTools().map((tool) => ({
  path: tool.meta.route,
  element: <tool.component />,
}));

const routes = [
  {
    path: '/',
    element: <App />,
  },
  ...plugins,
];

export const router = createBrowserRouter(routes);

// children: [
//   {
//     path: '/',
//     element: <Home />,
//   },
//   ...plugins,
// ],
