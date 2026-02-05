import React from 'react';
import type { ToolPlugin } from '@/core/types/tool';
import { meta } from './meta';

const plugin: ToolPlugin = {
  meta,
  component: React.lazy(() => import('./components/base64-formatter-card').then(m => ({ default: m.Base64FormatterCard }))),
};

export default plugin;
