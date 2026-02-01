import { Github, MessageCircle } from 'lucide-react';

// 重复的样式常量
const styles = {
  sectionTitle: 'font-semibold text-[#1f2937] dark:text-white mb-4',
  link: 'text-[#6b7280] dark:text-[#a0a0a0] hover:text-[#3b82f6] transition-colors text-sm',
  socialLink: 'text-[#9ca3af] dark:text-[#a0a0a0] hover:text-[#3b82f6] transition-colors',
  mutedText: 'text-[#6b7280] dark:text-[#a0a0a0]',
  border: 'border-[#e5e7eb] dark:border-[#374151]',
};

// 可复用的链接列表组件
type LinkItem = string | { name: string; href?: string; target?: string };

function LinkList({ links }: { links: LinkItem[] }) {
  return (
    <ul className="space-y-2">
      {links.map((link, index) => {
        const name = typeof link === 'string' ? link : link.name;
        const href = typeof link === 'string' ? '#' : link.href || '#';
        const target = typeof link === 'string' ? undefined : link.target;
        return (
          <li key={index}>
            <a
              href={href}
              className={styles.link}
              target={target}
              rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            >
              {name}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// 社交媒体链接配置
const socialLinks = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/fireJera/toolbox-web-react' },
  { icon: MessageCircle, label: 'Discord' },
];

// 链接栏目配置
const linkSections = [
  // {
  //   title: '工具分类',
  //   links: ['编码转换', '加密安全', '图像处理', '数据处理'],
  // },
  // {
  //   title: '支持',
  //   links: ['文档中心', 'API 接口', '常见问题', '联系我们'],
  // },
  {
    title: '社区',
    links: [
      { name: 'GitHub', href: 'https://github.com/fireJera/toolbox-web-react', target: '_blank' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0d0f16] border-t border-[#e5e7eb] dark:border-[#374151] mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* DevTools */}
          <div>
            <h3 className="text-xl font-bold text-[#3b82f6] mb-4">DevTools</h3>
            <p className={`${styles.mutedText} text-sm leading-relaxed`}>
              程序员必备的在线工具集合，提升开发效率
            </p>
          </div>

          {/* 动态渲染链接栏目 */}
          {linkSections.map(({ title, links }) => (
            <div key={title}>
              <h4 className={styles.sectionTitle}>{title}</h4>
              <LinkList links={links} />
            </div>
          ))}
        </div>

        <div className={`border-t ${styles.border} mt-12 pt-8`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col items-center md:items-start">
              <p className={`${styles.mutedText} text-sm mb-2`}>
                © 2026 DevTools. All rights reserved.
              </p>
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.mutedText} text-xs hover:text-[#3b82f6] transition-colors`}
              >
                沪ICP备2024095551号-1
              </a>
            </div>
            <div className="flex space-x-6">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href || '#'}
                  className={styles.socialLink}
                  aria-label={label}
                  target={href ? '_blank' : undefined}
                  rel={href ? 'noopener noreferrer' : undefined}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
