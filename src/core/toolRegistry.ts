import type { ToolPlugin } from './types/tool';

class ToolRegistry {
  private tools: ToolPlugin[] = [];
  register(plugin: ToolPlugin) {
    this.tools.push(plugin);
  }

  getAllTools() {
    return this.tools.sort((a, b) => (a.meta.order ?? 0) - (b.meta.order ?? 0));
  }

  getByRoute(route: string) {
    return this.tools.find((tool) => tool.meta.route === route);
  }
}

export const toolRegistry = new ToolRegistry();
