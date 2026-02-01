import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolGrid } from './components/ToolGrid';
import { RecommendedTools } from './components/RecommendedTools';
import { MoreTools } from './components/MoreTools';
import { Footer } from './components/Footer';

export function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0d0f16]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Hero />
        <ToolGrid />
        <RecommendedTools />
        <MoreTools />
      </main>
      <Footer />
    </div>
  );
}
