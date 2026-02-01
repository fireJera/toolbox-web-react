import type { ToolPlugin } from '@/core/types/tool';
import { meta } from './meta';
import { Base64FormatterCard } from './components/base64-formatter-card';

const plugin: ToolPlugin = {
  meta,
  component: Base64FormatterCard,
};

export default plugin;
