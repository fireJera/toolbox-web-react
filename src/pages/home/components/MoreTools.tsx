import { ToolCard } from './ToolCard';
import { Calculator, FileText, GitBranch, Terminal, Code, Database } from 'lucide-react';

export function MoreTools() {
  const tools = [
    {
      icon: Calculator,
      iconColor: 'bg-[#dbeafe]',
      title: '计算器',
      description: '编程专用计算器',
    },
    {
      icon: FileText,
      iconColor: 'bg-[#dcfce7]',
      title: 'Markdown 编辑器',
      description: '在线 Markdown 编辑',
    },
    {
      icon: GitBranch,
      iconColor: 'bg-[#f3e8ff]',
      title: 'Regex 测试',
      description: '正则表达式测试',
    },
    {
      icon: Terminal,
      iconColor: 'bg-[#fee2e2]',
      title: 'Cron 表达式',
      description: 'Cron 表达式生成',
    },
    {
      icon: Code,
      iconColor: 'bg-[#fef3c7]',
      title: '代码对比',
      description: '文本差异对比',
    },
    {
      icon: Database,
      iconColor: 'bg-[#e0e7ff]',
      title: 'SQL 格式化',
      description: 'SQL 语句格式化',
    },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#1f2937] mb-6">更多工具</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {tools.map((tool, index) => (
          <ToolCard
            key={index}
            icon={tool.icon}
            iconColor={tool.iconColor}
            title={tool.title}
            description={tool.description}
          />
        ))}
      </div>
      <div className="text-center">
        <button className="px-8 py-3 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors">
          查看所有工具
        </button>
      </div>
    </section>
  );
}
