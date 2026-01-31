import { Github, Twitter, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#e5e7eb] mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* DevTools */}
          <div>
            <h3 className="text-xl font-bold text-[#3b82f6] mb-4">DevTools</h3>
            <p className="text-[#6b7280] text-sm leading-relaxed">
              程序员必备的在线工具集合，提升开发效率
            </p>
          </div>

          {/* 工具分类 */}
          <div>
            <h4 className="font-semibold text-[#1f2937] mb-4">工具分类</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#3b82f6] transition-colors text-sm">
                  编码转换
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#3b82f6] transition-colors text-sm">
                  加密安全
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#3b82f6] transition-colors text-sm">
                  图像处理
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#3b82f6] transition-colors text-sm">
                  数据处理
                </a>
              </li>
            </ul>
          </div>

          {/* 支持 */}
          <div>
            <h4 className="font-semibold text-[#1f2937] mb-4">支持</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#3b82f6] transition-colors text-sm">
                  文档中心
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#3b82f6] transition-colors text-sm">
                  API 接口
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#3b82f6] transition-colors text-sm">
                  常见问题
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#3b82f6] transition-colors text-sm">
                  联系我们
                </a>
              </li>
            </ul>
          </div>

          {/* 社区 */}
          <div>
            <h4 className="font-semibold text-[#1f2937] mb-4">社区</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#3b82f6] transition-colors text-sm">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#3b82f6] transition-colors text-sm">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#3b82f6] transition-colors text-sm">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#3b82f6] transition-colors text-sm">
                  博客
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#e5e7eb] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#6b7280] text-sm mb-4 md:mb-0">
              © 2024 DevTools. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                aria-label="Discord"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
