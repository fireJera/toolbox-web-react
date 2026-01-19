import { useRef, useState } from 'react';
import { formatJson } from '@/tools/json/formatter';
import { Textarea } from '@/components/ui/textarea';
import './json.css'; // 引入样式文件

export default function JsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // 同步滚动（简易版）
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lines = input.split('\n'); // 计算行数

  const handleFormat = (value: string) => {
    try {
      setInput(value);
      const formatted = formatJson(value);
      setOutput(formatted);
    } catch (error) {
      setOutput('Invalid JSON');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-8 overflow-auto border-r border-gray-200 bg-white">
        <div className="textarea-container">
          <div className="line-numbers" ref={lineNumbersRef}>
            {lines.map((_, index) => (
              <div key={index} className="line-number">
                {index + 1}
              </div>
            ))}
          </div>
          <Textarea
            value={input}
            ref={textareaRef}
            onChange={(e) => handleFormat(e.target.value)}
            onScroll={handleScroll}
            className="text-area"
            placeholder="Enter JSON here"
            style={{ whiteSpace: 'pre-wrap', height: '100%' }} // 处理换行
          />
        </div>
      </div>
      <div className="flex-1 p-8 overflow-auto border-r border-gray-200 bg-white">
        <pre>{output}</pre>
      </div>
    </div>
  );
}
