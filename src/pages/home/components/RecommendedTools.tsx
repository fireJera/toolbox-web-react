import { useState } from 'react';
import { Braces, Lock } from 'lucide-react';

export function RecommendedTools() {
  // JSON Formatter State
  const [jsonInput, setJsonInput] = useState(
    '{"name": "张伟", "age": 28, "city": "北京", "skills": ["JavaScript", "Python", "Java"]}'
  );
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');

  // Base64 State
  const [base64Input, setBase64Input] = useState('Hello World! 这是一个测试字符串');
  const [base64Output, setBase64Output] = useState('');

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch (e) {
      setJsonError('JSON 格式错误');
      setJsonOutput('');
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(jsonInput);
      alert('JSON 格式正确');
      setJsonError('');
    } catch (e) {
      setJsonError('JSON 格式错误');
    }
  };

  const clearJson = () => {
    setJsonInput('');
    setJsonOutput('');
    setJsonError('');
  };

  const encodeBase64 = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(base64Input)));
      setBase64Output(encoded);
    } catch (e) {
      setBase64Output('编码失败');
    }
  };

  const decodeBase64 = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(base64Input)));
      setBase64Output(decoded);
    } catch (e) {
      setBase64Output('解码失败：输入不是有效的 Base64 字符串');
    }
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#1f2937] dark:text-white mb-6">推荐工具</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JSON Formatter */}
        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm dark:shadow-none p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#dbeafe] flex items-center justify-center mr-3">
              <Braces className="h-5 w-5 text-slate-700" />
            </div>
            <h3 className="text-xl font-semibold text-[#1f2937] dark:text-white">JSON 格式化</h3>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="请输入 JSON 数据"
            className="w-full h-40 p-4 border border-[#d1d5db] dark:border-[#4b5563] dark:bg-[#0d0f16] dark:text-white dark:placeholder-[#9ca3af] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent mb-4 resize-none"
          />

          <div className="flex gap-3 mb-4">
            <button
              onClick={formatJson}
              className="px-4 py-2 bg-[#3b82f6] dark:bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] dark:hover:bg-[#2563eb] transition-colors"
            >
              格式化
            </button>
            <button
              onClick={validateJson}
              className="px-4 py-2 bg-[#f3f4f6] dark:bg-[#374151] text-[#6b7280] dark:text-white rounded-lg text-sm font-medium hover:bg-[#e5e7eb] dark:hover:bg-[#4b5563] transition-colors"
            >
              验证
            </button>
            <button
              onClick={clearJson}
              className="px-4 py-2 bg-[#f3f4f6] dark:bg-[#374151] text-[#6b7280] dark:text-white rounded-lg text-sm font-medium hover:bg-[#e5e7eb] dark:hover:bg-[#4b5563] transition-colors"
            >
              清空
            </button>
          </div>

          {jsonError && (
            <div className="text-red-500 text-sm mb-4">{jsonError}</div>
          )}

          {jsonOutput && (
            <div className="relative">
              <textarea
                value={jsonOutput}
                readOnly
                className="w-full h-40 p-4 border border-[#e5e7eb] dark:border-[#4b5563] dark:bg-[#0d0f16] dark:text-white rounded-lg text-sm font-mono bg-[#f9fafb] resize-none"
              />
            </div>
          )}
        </div>

        {/* Base64 Encoder/Decoder */}
        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm dark:shadow-none p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#dcfce7] flex items-center justify-center mr-3">
              <Lock className="h-5 w-5 text-slate-700" />
            </div>
            <h3 className="text-xl font-semibold text-[#1f2937] dark:text-white">Base64 编解码</h3>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#374151] dark:text-[#a0a0a0] mb-2">原文</label>
            <textarea
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder="请输入需要编码或解码的内容"
              className="w-full h-32 p-4 border border-[#d1d5db] dark:border-[#4b5563] dark:bg-[#0d0f16] dark:text-white dark:placeholder-[#9ca3af] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={encodeBase64}
              className="px-4 py-2 bg-[#3b82f6] dark:bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] dark:hover:bg-[#2563eb] transition-colors"
            >
              编码
            </button>
            <button
              onClick={decodeBase64}
              className="px-4 py-2 bg-[#3b82f6] dark:bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] dark:hover:bg-[#2563eb] transition-colors"
            >
              解码
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] dark:text-[#a0a0a0] mb-2">结果</label>
            <textarea
              value={base64Output}
              readOnly
              placeholder="结果显示在这里"
              className="w-full h-32 p-4 border border-[#e5e7eb] dark:border-[#4b5563] dark:bg-[#0d0f16] dark:text-white rounded-lg text-sm font-mono bg-[#f9fafb] resize-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
