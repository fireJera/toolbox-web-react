import { Search, User, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-theme: dark)').matches;
    const shouldBeDark = saved === 'dark' || (!saved && prefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    document.documentElement.classList.toggle('dark', newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  };

  return (
    <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <span className="text-2xl font-bold text-[#3b82f6]">DevTools</span>
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className={`text-[#6b7280] hover:text-[#3b82f6] transition-colors font-medium relative after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-0.5 after:bg-[#3b82f6] after:transition-transform ${
                  location.pathname === '/'
                    ? 'after:scale-x-100 text-[#3b82f6]'
                    : 'after:scale-x-0 after:origin-left hover:after:scale-x-100'
                }`}
              >
                首页
              </a>
              <a
                href="/tools"
                className={`text-[#6b7280] hover:text-[#3b82f6] transition-colors font-medium relative after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-0.5 after:bg-[#3b82f6] after:transition-transform ${
                  location.pathname === '/tools'
                    ? 'after:scale-x-100 text-[#3b82f6]'
                    : 'after:scale-x-0 after:origin-left hover:after:scale-x-100'
                }`}
              >
                工具
              </a>
              <a
                href="/docs"
                className={`text-[#6b7280] hover:text-[#3b82f6] transition-colors font-medium relative after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-0.5 after:bg-[#3b82f6] after:transition-transform ${
                  location.pathname === '/docs'
                    ? 'after:scale-x-100 text-[#3b82f6]'
                    : 'after:scale-x-0 after:origin-left hover:after:scale-x-100'
                }`}
              >
                文档
              </a>
              <a
                href="/api"
                className={`text-[#6b7280] hover:text-[#3b82f6] transition-colors font-medium relative after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-0.5 after:bg-[#3b82f6] after:transition-transform ${
                  location.pathname === '/api'
                    ? 'after:scale-x-100 text-[#3b82f6]'
                    : 'after:scale-x-0 after:origin-left hover:after:scale-x-100'
                }`}
              >
                API
              </a>
            </nav>
          </div>

          {/* Search and User */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] h-4 w-4" />
              <input
                type="text"
                placeholder="搜索工具..."
                className="pl-10 pr-4 py-2 border border-[#d1d5db] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent w-48 lg:w-64"
              />
            </div>
            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full bg-[#e5e7eb] flex items-center justify-center hover:bg-[#f3f4f6] transition-colors"
            >
              {mounted && isDark ? (
                <Sun className="h-5 w-5 text-[#6b7280]" />
              ) : (
                <Moon className="h-5 w-5 text-[#6b7280]" />
              )}
            </button>
            <div className="h-9 w-9 rounded-full bg-[#e5e7eb] flex items-center justify-center hover:bg-[#f3f4f6] transition-colors cursor-pointer">
              <User className="h-5 w-5 text-[#6b7280]" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
