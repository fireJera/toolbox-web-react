import { ToolPlugin } from '@/core/types/tool';
import { meta } from './meta';
import JsonTool from './JsonTool';

const plugin: ToolPlugin = {
  meta,
  component: JsonTool,
};

export default plugin;
