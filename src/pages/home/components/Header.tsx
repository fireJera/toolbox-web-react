// import { Search, User } from 'lucide-react';
// import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  // const location = useLocation();

  // const navItems = [
  //   { href: '/', label: '首页' },
  //   { href: '/tools', label: '工具' },
  //   { href: '/docs', label: '文档' },
  //   { href: '/api', label: 'API' },
  // ];

  // const getLinkClassName = (path: string) =>
  //   `text-[#6b7280] dark:text-[#a0a0a0] hover:text-[#3b82f6] dark:hover:text-white transition-colors font-medium relative after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-0.5 after:bg-[#3b82f6] after:transition-transform ${
  //     location.pathname === path
  //       ? 'after:scale-x-100 text-[#3b82f6]'
  //       : 'after:scale-x-0 after:origin-left hover:after:scale-x-100'
  //   }`;

  return (
    <header className="bg-white dark:bg-[#1a1d29] border-b border-[#e5e7eb] dark:border-[#374151] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-[#3b82f6] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors cursor-pointer">
              DevTools
            </Link>
            {/* <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className={getLinkClassName(item.href)}>
                  {item.label}
                </a>
              ))}
            </nav> */}
          </div>

          {/* Search and User */}
          <div className="flex items-center space-x-4">
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] h-4 w-4" />
              <input
                type="text"
                placeholder="搜索工具..."
                className="pl-10 pr-4 py-2 border border-[#d1d5db] dark:border-[#4b5563] dark:bg-[#1f2937] dark:text-white dark:placeholder-[#9ca3af] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent w-48 lg:w-64"
              />
            </div> */}
            <ThemeToggle />
            {/* <div className="h-9 w-9 rounded-full bg-[#e5e7eb] dark:bg-[#374151] flex items-center justify-center hover:bg-[#f3f4f6] dark:hover:bg-[#4b5563] transition-colors cursor-pointer">
              <User className="h-5 w-5 text-[#6b7280] dark:text-white" />
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
}
