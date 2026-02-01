import { Hero } from './components/Hero';
import { ToolGrid } from './components/ToolGrid';
import { RecommendedTools } from './components/RecommendedTools';
// import { MoreTools } from './components/MoreTools';

export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Hero />
      <ToolGrid />
      <RecommendedTools />
      {/* <MoreTools /> */}
    </div>
  );
}
