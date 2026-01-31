import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  href?: string;
}

export function ToolCard({ icon: Icon, iconColor, title, description, href = '#' }: ToolCardProps) {
  return (
    <a
      href={href}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 group block"
    >
      <div className={`w-12 h-12 rounded-lg ${iconColor} flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-slate-700" />
      </div>
      <h3 className="text-lg font-semibold text-[#1f2937] mb-2 group-hover:text-[#3b82f6] transition-colors">
        {title}
      </h3>
      <p className="text-[#6b7280] text-sm leading-relaxed">{description}</p>
    </a>
  );
}
