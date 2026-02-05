import { useEffect } from 'react';
import { toolRegistry } from '@/core/toolRegistry';
import { Hero } from './components/Hero';
import { ToolGrid } from './components/ToolGrid';
import { RecommendedTools } from './components/RecommendedTools';
// import { MoreTools } from './components/MoreTools';

export function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      toolRegistry.getAllTools().forEach((tool) => {
        if (tool.load) {
          tool.load();
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Hero />
      <ToolGrid />
      <RecommendedTools />
      {/* <MoreTools /> */}
    </div>
  );
}
