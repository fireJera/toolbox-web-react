import { ToolCard } from './ToolCard';
import {
  Braces,
  Lock,
  Link as LinkIcon,
  Hash,
  Palette,
  Clock,
  Image as ImageIcon,
  Shield,
} from 'lucide-react';

export function ToolGrid() {
  const tools = [
    {
      icon: Braces,
      iconColor: 'bg-[#dbeafe]',
      title: 'JSON 格式化',
      description: '美化、验证和编辑 JSON 数据',
      href: '/json',
    },
    {
      icon: Lock,
      iconColor: 'bg-[#dcfce7]',
      title: 'Base64 编解码',
      description: 'Base64 编码和解码转换',
    },
    {
      icon: LinkIcon,
      iconColor: 'bg-[#f3e8ff]',
      title: 'URL 编解码',
      description: 'URL 编码和解码转换',
    },
    {
      icon: Hash,
      iconColor: 'bg-[#fee2e2]',
      title: 'MD5 加密',
      description: 'MD5 哈希值计算',
    },
    {
      icon: Palette,
      iconColor: 'bg-[#fef3c7]',
      title: '颜色转换',
      description: 'HEX、RGB、HSL 颜色转换',
    },
    {
      icon: Clock,
      iconColor: 'bg-[#e0e7ff]',
      title: '时间戳转换',
      description: 'Unix 时间戳和日期转换',
    },
    {
      icon: ImageIcon,
      iconColor: 'bg-[#fce7f3]',
      title: '图片压缩',
      description: '在线图片压缩工具',
    },
    {
      icon: Shield,
      iconColor: 'bg-[#ccfbf1]',
      title: '加密解密',
      description: 'AES、DES 加密解密',
    },
  ];

  return (
    <section id="tools" className="mb-12">
      <h2 className="text-2xl font-bold text-[#1f2937] dark:text-white mb-6">热门工具</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {tools.map((tool, index) => (
          <ToolCard
            key={index}
            icon={tool.icon}
            iconColor={tool.iconColor}
            title={tool.title}
            description={tool.description}
            href={tool.href}
          />
        ))}
      </div>
    </section>
  );
}
