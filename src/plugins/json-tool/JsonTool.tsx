import { useState } from 'react';
import { formatJson } from '@/tools/json/formatter';
import { Textarea } from '@/components/ui/textarea';

export default function JsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

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
        <Textarea
          value={input}
          onChange={(e) => handleFormat(e.target.value)}
          placeholder="Enter JSON here"
          rows={10}
          cols={50}
        />
      </div>
      <div className="flex-1 p-8 overflow-auto border-r border-gray-200 bg-white">
        <pre>{output}</pre>
      </div>
    </div>
  );
}
