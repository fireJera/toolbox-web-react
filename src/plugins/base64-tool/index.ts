import React from 'react';
import type { ToolPlugin } from '@/core/types/tool';
import { meta } from './meta';

const loader = () => import('./components/base64-formatter-card').then(m => ({ default: m.Base64FormatterCard }));

const plugin: ToolPlugin = {
  meta,
  component: React.lazy(loader),
  load: loader,
};

export default plugin;
