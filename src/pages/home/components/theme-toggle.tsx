import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
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

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full bg-[#e5e7eb] dark:bg-[#374151] hover:bg-[#f3f4f6] dark:hover:bg-[#4b5563] border-0 p-0"
      >
        <Sun className="h-5 w-5 text-[#6b7280] dark:text-white" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-full bg-[#e5e7eb] dark:bg-[#374151] hover:bg-[#f3f4f6] dark:hover:bg-[#4b5563] border-0 p-0"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-[#6b7280] dark:text-white" />
      ) : (
        <Moon className="h-5 w-5 text-[#6b7280]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
