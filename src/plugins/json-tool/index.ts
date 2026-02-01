import type { ToolPlugin } from '@/core/types/tool';
import { meta } from './meta';
import JsonTool from './json-tool';

const plugin: ToolPlugin = {
  meta,
  component: JsonTool,
};

export default plugin;
