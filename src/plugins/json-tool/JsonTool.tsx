// import { useRef, useState } from 'react';
// import { formatJson } from '@/tools/json/formatter';
// import { JsonEditor } from './components/json-editor';
// import './json.css'; // 引入样式文件

// export default function JsonTool() {
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState('');

//   const textareaRef = useRef(null);
//   const lineNumbersRef = useRef(null);

//   // 同步滚动（简易版）
//   const handleScroll = () => {
//     if (textareaRef.current && lineNumbersRef.current) {
//       lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
//     }
//   };

//   const lines = input.split('\n'); // 计算行数

//   const handleFormat = (value: string) => {
//     try {
//       setInput(value);
//       const formatted = formatJson(value);
//       setOutput(formatted);
//     } catch (error) {
//       setOutput('Invalid JSON');
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <div className="flex-1 p-8 overflow-auto border-r border-gray-200 bg-white">
//         <div className="textarea-container">
//           <JsonEditor value={input} onChange={handleFormat} error={null} />
//         </div>
//       </div>
//       <div className="flex-1 p-8 overflow-auto border-r border-gray-200 bg-white">
//         <pre>{output}</pre>
//       </div>
//     </div>
//   );
// }

import { useState, useCallback, useEffect } from 'react';
