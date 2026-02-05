import { LucideIcon } from 'lucide-react';
import { toolRegistry } from '@/core/toolRegistry';

interface ToolCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  href?: string;
}

export function ToolCard({ icon: Icon, iconColor, title, description, href = '#' }: ToolCardProps) {
  const handleMouseEnter = () => {
    if (href && href !== '#') {
      const tool = toolRegistry.getByRoute(href);
      if (tool?.load) {
        tool.load();
      }
    }
  };

  return (
    <a
      href={href}
      className="bg-white dark:bg-[#1f2937] rounded-xl p-6 shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200 group block"
      onMouseEnter={handleMouseEnter}
    >
      <div className={`w-12 h-12 rounded-lg ${iconColor} flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-slate-700" />
      </div>
      <h3 className="text-lg font-semibold text-[#1f2937] dark:text-white mb-2 group-hover:text-[#3b82f6] transition-colors">
        {title}
      </h3>
      <p className="text-[#6b7280] dark:text-[#a0a0a0] text-sm leading-relaxed">{description}</p>
    </a>
  );
}
