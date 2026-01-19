import { toolRegistry } from './toolRegistry';

const modules = import.meta.glob('@/plugins/**/index.{ts,tsx}', { eager: true });

Object.values(modules).forEach((module) => {
  toolRegistry.register(module.default);
});
