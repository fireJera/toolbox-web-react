import React from 'react';
import type { ToolPlugin } from '@/core/types/tool';
import { meta } from './meta';

const plugin: ToolPlugin = {
  meta,
  component: React.lazy(() => import('./json-tool')),
};

export default plugin;
