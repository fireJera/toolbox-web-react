import { Outlet } from 'react-router-dom';
import { Header } from '@/pages/home/components/Header';
import { Footer } from '@/pages/home/components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0d0f16]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
