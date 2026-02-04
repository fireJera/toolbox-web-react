'use client';

import { cn } from '@/lib/utils';
import type { IndentSize, CodeLanguage } from '@/plugins/json-tool/json-tool';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';

interface JsonTypeViewProps {
  data: unknown;
  indentSize?: IndentSize;
  codeLanguage: CodeLanguage;
}

function getTypeInfo(value: unknown): {
  type: string;
  info?: string;
  color: string;
} {
  if (value === null) {
    return { type: 'null', color: 'text-json-null' };
  }

  if (Array.isArray(value)) {
    const itemTypes = [...new Set(value.map((v) => getTypeInfo(v).type))];
    return {
      type: 'array',
      info: `${value.length} items${itemTypes.length === 1 ? ` of ${itemTypes[0]}` : ''}`,
      color: 'text-muted-foreground',
    };
  }

  switch (typeof value) {
    case 'string':
      return { type: 'string', info: `${value.length} chars`, color: 'text-json-string' };
    case 'number':
      return {
        type: Number.isInteger(value) ? 'integer' : 'float',
        color: 'text-json-number',
      };
    case 'boolean':
      return { type: 'boolean', color: 'text-json-boolean' };
    case 'object':
      return {
        type: 'object',
        info: `${Object.keys(value as object).length} keys`,
        color: 'text-muted-foreground',
      };
    default:
      return { type: typeof value, color: 'text-foreground' };
  }
}

// 生成不同编程语言的类型定义
function generateTypeDefinition(data: unknown, language: CodeLanguage, rootName = 'Root'): string {
  // 处理根节点是数组的情况：循环查找第一个对象类型的元素
  let actualData = data;
  if (Array.isArray(data)) {
    // 检查空数组
    if (data.length === 0) {
      return `// Root is an empty array\n// No type definition can be generated from an empty array\n// Please provide JSON with actual data`;
    }

    let current = data;
    let depth = 0;
    const maxDepth = 10; // 防止无限循环

    while (Array.isArray(current) && current.length > 0 && depth < maxDepth) {
      const first = current[0];
      if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
        // 找到对象类型，使用它来生成类型定义
        actualData = first;
        break;
      } else if (Array.isArray(first)) {
        // 检查嵌套的空数组
        if (first.length === 0) {
          return `// Root contains a nested empty array\n// No type definition can be generated`;
        }
        // 还是数组，继续循环
        current = first;
        depth++;
      } else {
        // 是基本类型，提示无需转换
        const typeName = typeof first === 'string' ? 'string' :
                         typeof first === 'number' ? (Number.isInteger(first) ? 'integer' : 'number') :
                         typeof first === 'boolean' ? 'boolean' : 'unknown';
        return `// Root is an array of primitive type (${typeName})\n// No type definition needed for: ${JSON.stringify(data, null, 2)}`;
      }
    }

    // 如果循环完还是数组或超过最大深度
    if (depth === 0 && Array.isArray(data) && data.length > 0) {
      const first = data[0];
      if (typeof first !== 'object' || first === null || Array.isArray(first)) {
        const typeName = typeof first === 'string' ? 'string' :
                         typeof first === 'number' ? (Number.isInteger(first) ? 'integer' : 'number') :
                         typeof first === 'boolean' ? 'boolean' : 'unknown';
        return `// Root is an array of primitive type (${typeName})\n// No type definition needed for: ${JSON.stringify(data, null, 2)}`;
      }
    }

    // 超过最大深度，说明是深度嵌套的数组结构
    if (depth >= maxDepth) {
      return `// Root is a deeply nested array structure (depth > ${maxDepth})\n// Cannot safely determine the type structure`;
    }
  }

  // 将名称转换为PascalCase
  const toPascalCase = (name: string): string => {
    return name
      .split(/[_\s-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  };

  // 收集所有需要定义的类型（除了Root）
  const types = new Map<string, Record<string, unknown>>();
  const collectTypes = (value: unknown, name: string, isRoot = false) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length > 0) {
        const typeName = toPascalCase(name);
        // 不要把Root加入types集合，Root需要单独完整定义
        if (!isRoot && !types.has(typeName)) {
          types.set(typeName, value as Record<string, unknown>);
        }
        entries.forEach(([k, v]) => {
          if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
            collectTypes(v, k, false);
          }
        });
      }
    }
  };

  collectTypes(actualData, rootName, true);

  const tsType = (value: unknown, name: string): string => {
    if (value === null) return 'null';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'any[]';
      const itemTypes = [...new Set(value.map((v) => tsType(v, '')))];
      return itemTypes.length === 1 ? `${itemTypes[0]}[]` : 'any[]';
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return 'Record<string, unknown>';
      // 检查是否已经有独立类型定义
      const typeName = toPascalCase(name);
      if (types.has(typeName)) {
        return typeName;
      }
      // 如果没有独立类型，内联定义
      const fields = entries
        .map(([k, v]) => `  ${k}: ${tsType(v, k)};`)
        .join('\n');
      return `{\n${fields}\n}`;
    }
    return 'any';
  };

  const goType = (value: unknown, name: string, indent = 0): string => {
    const ind = ' '.repeat(indent);
    if (value === null) return 'interface{}';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float64';
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]interface{}';
      const itemType = goType(value[0], '', indent);
      return `[]${itemType}`;
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return 'map[string]interface{}';
      // 检查是否已经有独立类型定义
      const typeName = toPascalCase(name);
      if (types.has(typeName)) {
        return typeName;
      }
      const fields = entries
        .map(([k, v]) => {
          const jsonTag = `json:"${k}"`;
          const goField = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
          return `${ind}  ${goField.charAt(0).toUpperCase() + goField.slice(1)} ${goType(v, k, indent)} \`${jsonTag}\``;
        })
        .join('\n');
      return `struct {\n${fields}\n${ind}}`;
    }
    return 'interface{}';
  };

  const rustType = (value: unknown, name: string, indent = 0): string => {
    const ind = ' '.repeat(indent);
    if (value === null) return 'Option<Value>';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return Number.isInteger(value) ? 'i64' : 'f64';
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Vec<Value>';
      const itemType = rustType(value[0], '', indent);
      return `Vec<${itemType}>`;
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return 'HashMap<String, Value>';
      // 检查是否已经有独立类型定义
      const typeName = toPascalCase(name);
      if (types.has(typeName)) {
        return typeName;
      }
      const fieldName = toPascalCase(name);
      const fields = entries
        .map(([k, v]) => {
          const rustField = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
          return `${ind}  pub ${rustField}: ${rustType(v, k, indent)},`;
        })
        .join('\n');
      return `struct ${fieldName} {\n${fields}\n${ind}}`;
    }
    return 'Value';
  };

  const pythonType = (value: unknown, name: string, indent = 0): string => {
    const ind = '  '.repeat(indent);
    if (value === null) return 'None';
    if (typeof value === 'string') return 'str';
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float';
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'list';
      const itemType = pythonType(value[0], '', indent);
      return `list[${itemType}]`;
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return 'dict';
      // 检查是否已经有独立类型定义
      const className = toPascalCase(name);
      if (types.has(className)) {
        return className;
      }
      const fields = entries
        .map(([k, v]) => `${ind}${k}: ${pythonType(v, k, indent)}`)
        .join('\n');
      return `class ${className}(TypedDict):\n${fields}`;
    }
    return 'Any';
  };

  const javaType = (value: unknown, name: string, indent = 0): string => {
    const ind = '  '.repeat(indent);
    if (value === null) return 'Object';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return Number.isInteger(value) ? 'Integer' : 'Double';
    if (typeof value === 'boolean') return 'Boolean';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'List<Object>';
      const itemType = javaType(value[0], '', indent);
      return `List<${itemType}>`;
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return 'Map<String, Object>';
      // 检查是否已经有独立类型定义
      const className = toPascalCase(name);
      if (types.has(className)) {
        return className;
      }
      const fields = entries
        .map(([k, v]) => {
          const javaField = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
          const fieldUpper = javaField.charAt(0).toUpperCase() + javaField.slice(1);
          return `${ind}  private ${javaType(v, k, indent)} ${javaField};\n${ind}  public ${javaType(v, k, indent)} get${fieldUpper}() { return this.${javaField}; }\n${ind}  public void set${fieldUpper}(${javaType(v, k, indent)} ${javaField}) { this.${javaField} = ${javaField}; }`;
        })
        .join('\n');
      return `public static class ${className} {\n${fields}\n${ind}}`;
    }
    return 'Object';
  };

  const csharpType = (value: unknown, name: string, indent = 0): string => {
    const ind = '  '.repeat(indent);
    if (value === null) return 'object';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'double';
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'List<object>';
      const itemType = csharpType(value[0], '', indent);
      return `List<${itemType}>`;
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return 'Dictionary<string, object>';
      // 检查是否已经有独立类型定义
      const className = toPascalCase(name);
      if (types.has(className)) {
        return className;
      }
      const fields = entries
        .map(([k, v]) => {
          const csharpField = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
          return `${ind}  public ${csharpType(v, k, indent)} ${csharpField} { get; set; }`;
        })
        .join('\n');
      return `public class ${className} {\n${fields}\n${ind}}`;
    }
    return 'object';
  };

  const cppType = (value: unknown, name: string, indent = 0): string => {
    const ind = '  '.repeat(indent);
    if (value === null) return 'std::nullptr_t';
    if (typeof value === 'string') return 'std::string';
    if (typeof value === 'number') return Number.isInteger(value) ? 'int64_t' : 'double';
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'std::vector<nlohmann::json>';
      const itemType = cppType(value[0], '', indent);
      return `std::vector<${itemType}>`;
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return 'nlohmann::json';
      // 检查是否已经有独立类型定义
      const structName = toPascalCase(name);
      if (types.has(structName)) {
        return structName;
      }
      const fields = entries
        .map(([k, v]) => `${ind}  ${cppType(v, k, indent)} ${k};`)
        .join('\n');
      return `struct ${structName} {\n${fields}\n${ind}};`;
    }
    return 'nlohmann::json';
  };

  const swiftType = (value: unknown, name: string, indent = 0): string => {
    const ind = '  '.repeat(indent);
    if (value === null) return 'Any?';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return Number.isInteger(value) ? 'Int' : 'Double';
    if (typeof value === 'boolean') return 'Bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[Any]';
      const itemType = swiftType(value[0], '', indent);
      return `[${itemType}]`;
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return '[String: Any]';
      // 检查是否已经有独立类型定义
      const structName = toPascalCase(name);
      if (types.has(structName)) {
        return structName;
      }
      const fields = entries
        .map(([k, v]) => {
          const swiftField = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
          return `${ind}  let ${swiftField}: ${swiftType(v, k, indent)}`;
        })
        .join('\n');
      return `struct ${structName}: Codable {\n${fields}\n${ind}}`;
    }
    return 'Any';
  };

  const kotlinType = (value: unknown, name: string, indent = 0): string => {
    const ind = '  '.repeat(indent);
    if (value === null) return 'Any?';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return Number.isInteger(value) ? 'Int' : 'Double';
    if (typeof value === 'boolean') return 'Boolean';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'List<Any>';
      const itemType = kotlinType(value[0], '', indent);
      return `List<${itemType}>`;
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return 'Map<String, Any>';
      // 检查是否已经有独立类型定义
      const className = toPascalCase(name);
      if (types.has(className)) {
        return className;
      }
      const fields = entries
        .map(([k, v]) => {
          const kotlinField = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
          return `${ind}  val ${kotlinField}: ${kotlinType(v, k, indent)}`;
        })
        .join('\n');
      return `@Serializable\ndata class ${className}(\n${fields}\n${ind})`;
    }
    return 'Any';
  };

  const objcType = (value: unknown, name: string, indent = 0): string => {
    const ind = '  '.repeat(indent);
    if (value === null) return 'id _Nullable';
    if (typeof value === 'string') return 'NSString *';
    if (typeof value === 'number') return Number.isInteger(value) ? 'NSInteger ' : 'double ';
    if (typeof value === 'boolean') return 'BOOL ';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'NSArray *';
      const itemType = objcType(value[0], '', indent);
      return `NSArray<${itemType.trim()}> *`;
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return 'NSDictionary *';
      // 检查是否已经有独立类型定义
      const interfaceName = toPascalCase(name);
      if (types.has(interfaceName)) {
        return interfaceName + ' *';
      }
      const fields = entries
        .map(([k, v]) => {
          const objcProp = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
          const typeStr = objcType(v, k, indent);
          // 判断是否需要使用 copy 修饰符 (NSString 或 NSArray)
          const isCopy = typeStr.includes('NSString') || typeStr.includes('NSArray');
          const isObject = typeStr.trim().endsWith('*') || typeStr.includes('id');
          const modifier = isCopy ? 'copy' : (isObject ? 'strong' : 'assign');
          return `${ind}@property (nonatomic, ${modifier}) ${typeStr}${objcProp};`;
        })
        .join('\n');
      return `@interface ${interfaceName} : NSObject\n${fields}\n@end`;
    }
    return 'id ';
  };

  // 生成所有子类型定义
  const generateSubTypes = (lang: CodeLanguage): string[] => {
    const subTypes: string[] = [];
    // Root不在types集合中，所以这里获取的types都是子类型
    const typeNames = Array.from(types.keys());

    switch (lang) {
      case 'typescript':
        typeNames.forEach(typeName => {
          const typeData = types.get(typeName)!;
          const entries = Object.entries(typeData);
          const fields = entries
            .map(([k, v]) => `  ${k}: ${tsType(v, k)};`)
            .join('\n');
          subTypes.push(`type ${typeName} = {\n${fields}\n};`);
        });
        break;

      case 'go':
        typeNames.forEach(typeName => {
          const typeData = types.get(typeName)!;
          const entries = Object.entries(typeData);
          const fields = entries
            .map(([k, v]) => {
              const jsonTag = `json:"${k}"`;
              const goField = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
              return `  ${goField.charAt(0).toUpperCase() + goField.slice(1)} ${goType(v, k, 0)} \`${jsonTag}\``;
            })
            .join('\n');
          subTypes.push(`type ${typeName} struct {\n${fields}\n}`);
        });
        break;

      case 'rust':
        typeNames.forEach(typeName => {
          const typeData = types.get(typeName)!;
          const entries = Object.entries(typeData);
          const fields = entries
            .map(([k, v]) => {
              const rustField = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
              return `  pub ${rustField}: ${rustType(v, k, 0)},`;
            })
            .join('\n');
          subTypes.push(`struct ${typeName} {\n${fields}\n}`);
        });
        break;

      case 'python':
        typeNames.forEach(typeName => {
          const typeData = types.get(typeName)!;
          const entries = Object.entries(typeData);
          const fields = entries
            .map(([k, v]) => `  ${k}: ${pythonType(v, k, 1)}`)
            .join('\n');
          subTypes.push(`class ${typeName}(TypedDict):\n${fields}`);
        });
        break;

      case 'java':
        typeNames.forEach(typeName => {
          const typeData = types.get(typeName)!;
          const entries = Object.entries(typeData);
          const fields = entries
            .map(([k, v]) => {
              const javaField = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
              const fieldUpper = javaField.charAt(0).toUpperCase() + javaField.slice(1);
              return `  private ${javaType(v, k, 0)} ${javaField};\n  public ${javaType(v, k, 0)} get${fieldUpper}() { return this.${javaField}; }\n  public void set${fieldUpper}(${javaType(v, k, 0)} ${javaField}) { this.${javaField} = ${javaField}; }`;
            })
            .join('\n');
          subTypes.push(`public static class ${typeName} {\n${fields}\n}`);
        });
        break;

      case 'csharp':
        typeNames.forEach(typeName => {
          const typeData = types.get(typeName)!;
          const entries = Object.entries(typeData);
          const fields = entries
            .map(([k, v]) => {
              const csharpField = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
              return `  public ${csharpType(v, k, 0)} ${csharpField} { get; set; }`;
            })
            .join('\n');
          subTypes.push(`public class ${typeName} {\n${fields}\n}`);
        });
        break;

      case 'cpp':
        typeNames.forEach(typeName => {
          const typeData = types.get(typeName)!;
          const entries = Object.entries(typeData);
          const fields = entries
            .map(([k, v]) => `  ${cppType(v, k, 0)} ${k};`)
            .join('\n');
          subTypes.push(`struct ${typeName} {\n${fields}\n};`);
        });
        break;

      case 'swift':
        typeNames.forEach(typeName => {
          const typeData = types.get(typeName)!;
          const entries = Object.entries(typeData);
          const fields = entries
            .map(([k, v]) => {
              const swiftField = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
              return `  let ${swiftField}: ${swiftType(v, k, 0)}`;
            })
            .join('\n');
          subTypes.push(`struct ${typeName}: Codable {\n${fields}\n}`);
        });
        break;

      case 'kotlin':
        typeNames.forEach(typeName => {
          const typeData = types.get(typeName)!;
          const entries = Object.entries(typeData);
          const fields = entries
            .map(([k, v]) => {
              const kotlinField = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
              return `  val ${kotlinField}: ${kotlinType(v, k, 0)}`;
            })
            .join('\n');
          subTypes.push(`@Serializable\ndata class ${typeName}(\n${fields}\n)`);
        });
        break;

      case 'objc':
        typeNames.forEach(typeName => {
          const typeData = types.get(typeName)!;
          const entries = Object.entries(typeData);
          const fields = entries
            .map(([k, v]) => {
              const objcProp = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
              const typeStr = objcType(v, k, 0);
              // 判断是否需要使用 copy 修饰符 (NSString 或 NSArray)
              const isCopy = typeStr.includes('NSString') || typeStr.includes('NSArray');
              const isObject = typeStr.trim().endsWith('*') || typeStr.includes('id');
              const modifier = isCopy ? 'copy' : (isObject ? 'strong' : 'assign');
              return `@property (nonatomic, ${modifier}) ${typeStr}${objcProp};`;
            })
            .join('\n');
          subTypes.push(`@interface ${typeName} : NSObject\n${fields}\n@end`);
        });
        break;
    }

    return subTypes;
  };

  switch (language) {
    case 'typescript': {
      const subTypes = generateSubTypes('typescript');
      const rootType = `type ${rootName} = ${tsType(actualData, rootName)};`;
      return subTypes.length > 0 ? `${subTypes.join('\n\n')}\n\n${rootType}` : rootType;
    }
    case 'go': {
      const subTypes = generateSubTypes('go');
      const rootType = `type ${rootName} ${goType(actualData, rootName)};`;
      return subTypes.length > 0 ? `${subTypes.join('\n\n')}\n\n${rootType}` : rootType;
    }
    case 'rust': {
      const subTypes = generateSubTypes('rust');
      let rootDef = '';
      if (typeof actualData === 'object' && actualData !== null && !Array.isArray(actualData)) {
        const entries = Object.entries(actualData as Record<string, unknown>);
        if (entries.length > 0) {
          const fields = entries
            .map(([k, v]) => {
              const rustField = k.split('_').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
              return `  pub ${rustField}: ${rustType(v, k, 0)},`;
            })
            .join('\n');
          rootDef = `struct ${rootName} {\n${fields}\n}`;
        }
      }
      const result = subTypes.length > 0 ? `${subTypes.join('\n\n')}\n\n${rootDef}` : rootDef;
      return `${result}\n\n// For JSON parsing, consider using serde\ncfg_if::cfg_if! {\n  if #[cfg(feature = "derive")] {\n    use serde::{Serialize, Deserialize};\n  }\n}`;
    }
    case 'python': {
      const subTypes = generateSubTypes('python');
      let rootDef = '';
      if (typeof actualData === 'object' && actualData !== null && !Array.isArray(actualData)) {
        const entries = Object.entries(actualData as Record<string, unknown>);
        if (entries.length > 0) {
          const fields = entries
            .map(([k, v]) => `  ${k}: ${pythonType(v, k, 1)}`)
            .join('\n');
          rootDef = `class ${rootName}(TypedDict):\n${fields}`;
        }
      }
      const result = subTypes.length > 0 ? `${subTypes.join('\n\n')}\n\n${rootDef}` : rootDef;
      return `from typing import TypedDict, List, Optional\n\n${result}`;
    }
    case 'java': {
      const subTypes = generateSubTypes('java');
      let rootDef = '';
      if (typeof actualData === 'object' && actualData !== null && !Array.isArray(actualData)) {
        rootDef = javaType(actualData, rootName);
      }
      const result = subTypes.length > 0 ? `${subTypes.join('\n\n')}\n\n${rootDef}` : rootDef;
      return `import java.util.*;\n\n${result}`;
    }
    case 'csharp': {
      const subTypes = generateSubTypes('csharp');
      let rootDef = '';
      if (typeof actualData === 'object' && actualData !== null && !Array.isArray(actualData)) {
        rootDef = csharpType(actualData, rootName);
      }
      const result = subTypes.length > 0 ? `${subTypes.join('\n\n')}\n\n${rootDef}` : rootDef;
      return `using System;\nusing System.Collections.Generic;\n\n${result}`;
    }
    case 'cpp': {
      const subTypes = generateSubTypes('cpp');
      let rootDef = '';
      if (typeof actualData === 'object' && actualData !== null && !Array.isArray(actualData)) {
        rootDef = cppType(actualData, rootName);
      }
      const result = subTypes.length > 0 ? `${subTypes.join('\n\n')}\n\n${rootDef}` : rootDef;
      return `#include <string>\n#include <vector>\n#include <cstdint>\n#include <nlohmann/json.hpp>\n\n${result}`;
    }
    case 'swift': {
      const subTypes = generateSubTypes('swift');
      let rootDef = '';
      if (typeof actualData === 'object' && actualData !== null && !Array.isArray(actualData)) {
        rootDef = swiftType(actualData, rootName);
      }
      const result = subTypes.length > 0 ? `${subTypes.join('\n\n')}\n\n${rootDef}` : rootDef;
      return `import Foundation\n\n${result}`;
    }
    case 'kotlin': {
      const subTypes = generateSubTypes('kotlin');
      let rootDef = '';
      if (typeof actualData === 'object' && actualData !== null && !Array.isArray(actualData)) {
        rootDef = kotlinType(actualData, rootName);
      }
      const result = subTypes.length > 0 ? `${subTypes.join('\n\n')}\n\n${rootDef}` : rootDef;
      return `import kotlinx.serialization.*\n\n${result}`;
    }
    case 'objc': {
      const subTypes = generateSubTypes('objc');
      let rootDef = '';
      if (typeof actualData === 'object' && actualData !== null && !Array.isArray(actualData)) {
        rootDef = objcType(actualData, rootName);
      }
      const result = subTypes.length > 0 ? `${subTypes.join('\n\n')}\n\n${rootDef}` : rootDef;
      return `#import <Foundation/Foundation.h>\n\n${result}`;
    }
    default:
      return `// Unsupported language: ${language}`;
  }
}

interface TypeNodeProps {
  label: string | number;
  value: unknown;
  level: number;
}

function TypeNode({ label, value, level }: TypeNodeProps) {
  const typeInfo = getTypeInfo(value);
  const isExpandable = (typeof value === 'object' && value !== null) || Array.isArray(value);

  const hasChildren =
    isExpandable &&
    (Array.isArray(value) ? value.length > 0 : Object.keys(value as object).length > 0);

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 rounded px-2 py-1 hover:bg-accent/50"
        style={{ paddingLeft: `${level * 20 + 8}px` }}
      >
        <span className="text-json-key font-medium min-w-0 shrink-0">
          {typeof label === 'string' ? label : `[${label}]`}
        </span>
        <span className="text-muted-foreground">:</span>
        <span
          className={cn(
            'rounded-md border px-2 py-0.5 text-xs font-mono',
            typeInfo.color,
            'border-current/20 bg-current/5',
          )}
        >
          {typeInfo.type}
        </span>
        {typeInfo.info && <span className="text-xs text-muted-foreground">({typeInfo.info})</span>}
      </div>

      {hasChildren && (
        <div>
          {Array.isArray(value)
            ? value.map((item, index) => (
                <TypeNode key={index} label={index} value={item} level={level + 1} />
              ))
            : Object.entries(value as Record<string, unknown>).map(([key, val]) => (
                <TypeNode key={key} label={key} value={val} level={level + 1} />
              ))}
        </div>
      )}
    </div>
  );
}

export function JsonTypeView({ data, indentSize: _indentSize, codeLanguage }: JsonTypeViewProps) {
  const { resolvedTheme } = useTheme();

  // 根据选中的语言生成类型定义代码
  const typeDefinition = generateTypeDefinition(data, codeLanguage);

  // 将语言映射到Monaco Editor的语言模式
  const languageMap: Record<CodeLanguage, string> = {
    typescript: 'typescript',
    go: 'go',
    rust: 'rust',
    python: 'python',
    java: 'java',
    csharp: 'csharp',
    cpp: 'cpp',
    swift: 'swift',
    kotlin: 'kotlin',
    objc: 'objective-c',
  };

  const monacoLanguage = languageMap[codeLanguage];

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage={monacoLanguage}
        value={typeDefinition}
        theme={resolvedTheme === 'dark' ? 'json-dark' : 'json-light'}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'consolas, menlo, monaco, "Ubuntu Mono", source-code-pro, monospace',
          lineHeight: 24,
          tabSize: 2,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 4,
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          contextmenu: true,
          bracketPairColorization: { enabled: true },
          guides: {
            indentation: true,
            bracketPairs: true,
          },
        }}
      />
    </div>
  );
}
