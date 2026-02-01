import { toolRegistry } from '@/core/toolRegistry';
import { JsonFormatterCard } from '@/plugins/json-tool/components/json-formatter-card';
import { Base64FormatterCard } from '@/plugins/base64-tool/components/base64-formatter-card';

export function RecommendedTools() {
  // Check if tools are registered
  const jsonToolRegistered = toolRegistry.getByRoute('/json');
  const base64ToolRegistered = toolRegistry.getByRoute('/base64');

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#1f2937] dark:text-white mb-6">推荐工具</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JSON Formatter - only show if registered */}
        {jsonToolRegistered && <JsonFormatterCard />}

        {/* Base64 Encoder/Decoder - only show if registered */}
        {base64ToolRegistered && <Base64FormatterCard />}
      </div>
    </section>
  );
}
