import type { ReactNode } from 'react';

export interface ToolMeta {
  id: string;
  name: string;
  category: string;
  description: string;
  icon?: ReactNode;
  route: string;
  order?: number;
}

export interface ToolData {
  id: string;
  name: string;
  category: string;
  description: string;
  icon?: ReactNode;
  route: string;
  order?: number;
}

export interface ToolPlugin {
  meta: ToolMeta;
  component: React.FC;
}
