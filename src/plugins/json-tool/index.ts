import React from 'react';
import type { ToolPlugin } from '@/core/types/tool';
import { meta } from './meta';

const loader = () => import('./json-tool');

const plugin: ToolPlugin = {
  meta,
  component: React.lazy(loader),
  load: loader,
};

export default plugin;
