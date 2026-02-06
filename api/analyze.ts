/**
 * Vercel Serverless Function - AI分析
 * 支持多厂商LLM服务进行海报文案诊断
 */

export const config = {
  runtime: 'edge',
  maxDuration: 60,
};

interface AnalyzeRequest {
  text: string;
  image?: string;
  provider: string;
  terminology: any[];
  mode: 'image' | 'text';
}

interface DetectionResult {
  originalText: string;
  errors: Array<{
    text: string;
    type: 'spelling' | 'grammar' | 'terminology' | 'style';
    suggestion: string;
    alternatives: string[];
    explanation: string;
    location?: [number, number, number, number];
  }>;
  isProfessional: boolean;
  score: number;
}

// Gemini 分析
async function geminiAnalyze(
  text: string,
  image: string | undefined,
  terminology: any[],
  mode: string,
  apiKey: string
): Promise<DetectionResult> {
  const systemPrompt = `
角色：资深安防行业外贸设计师及国际化技术翻译专家。
背景：我们是一家领先的安防外贸公司，正在进行 2026 年度旗舰产品的全球海报校对工作。

任务：
1. **强制性词库比对 (核心任务)**：
   你必须检查文本中涉及的所有技术术语是否符合下方的【公司标准词库】。
   - 如果文本中出现了词库中的 "term"，但词库建议了 "preferredAlternative" (优选词)，必须将其标记为 'terminology' 类型错误，并给出该优选词。
   - 如果文本中出现了与词库定义相同但表达不规范的非专业词汇，必须根据词库定义进行纠正。
   - 标准词库数据：${JSON.stringify(terminology)}

2. **全方位质量分析**：
   - **拼写与语法**：检查国际安防买家关注的拼写错误。
   - **技术参数表现**：确保参数表达（如 4K, 30fps, IP67, IK10）符合行业规范。
   - **品牌语调**：评估其是否具备高端、安全、可靠的安防品牌感觉。

3. **结果输出**：使用中文进行解释。

待分析${mode === 'image' ? '图片文本' : '文案'}：
"""
${text}
"""
`;

  const contents: any = {
    parts: []
  };

  if (mode === 'image' && image) {
    contents.parts.push({
      inline_data: {
        mime_type: 'image/png',
        data: image
      }
    });
  }

  contents.parts.push({ text: systemPrompt });

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [contents],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              originalText: { type: 'string' },
              isProfessional: { type: 'boolean' },
              score: { type: 'number' },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    text: { type: 'string' },
                    type: { type: 'string', enum: ['spelling', 'grammar', 'terminology', 'style'] },
                    suggestion: { type: 'string' },
                    alternatives: { type: 'array', items: { type: 'string' } },
                    explanation: { type: 'string' },
                    location: { type: 'array', items: { type: 'number' } }
                  },
                  required: ['text', 'type', 'suggestion', 'alternatives', 'explanation', 'location']
                }
              }
            },
            required: ['originalText', 'isProfessional', 'score', 'errors']
          }
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini analyze failed: ${response.statusText}`);
  }

  const data = await response.json();
  const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!resultText) {
    throw new Error('Analysis returned empty response');
  }

  return JSON.parse(resultText);
}

// 豆包分析
async function doubaoAnalyze(
  text: string,
  image: string | undefined,
  terminology: any[],
  mode: string,
  apiKey: string
): Promise<DetectionResult> {
  const systemPrompt = `你是资深安防行业技术翻译官与品牌文案专家。请分析以下内容并返回JSON格式的诊断结果。

标准词库：${JSON.stringify(terminology)}

要求：
1. 检查术语是否符合标准词库
2. 检查拼写和语法错误
3. 评估专业度和品牌语调
4. 返回JSON格式，包含originalText, isProfessional, score, errors数组

待分析文本：
${text}
`;

  const messages: any = [
    {
      role: 'system',
      content: '你是专业的安防行业文案分析专家，擅长诊断海报文案错误。'
    },
    {
      role: 'user',
      content: mode === 'image' && image
        ? [
            {
              type: 'image_url',
              image_url: { url: `data:image/png;base64,${image}` }
            },
            {
              type: 'text',
              text: systemPrompt
            }
          ]
        : systemPrompt
    }
  ];

  const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: mode === 'image' ? 'doubao-vision-pro-32k' : 'doubao-pro-32k',
      messages,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    throw new Error(`Doubao analyze failed: ${response.statusText}`);
  }

  const data = await response.json();
  const resultText = data.choices?.[0]?.message?.content;

  if (!resultText) {
    throw new Error('Analysis returned empty response');
  }

  return JSON.parse(resultText);
}

// OpenAI 分析
async function openaiAnalyze(
  text: string,
  image: string | undefined,
  terminology: any[],
  mode: string,
  apiKey: string
): Promise<DetectionResult> {
  const systemPrompt = `你是专业的安防行业文案分析专家。

标准词库：${JSON.stringify(terminology)}

请分析文本并返回JSON格式：
{
  "originalText": "原始文本",
  "isProfessional": true/false,
  "score": 0-100,
  "errors": [
    {
      "text": "错误文本",
      "type": "spelling/grammar/terminology/style",
      "suggestion": "建议修改",
      "alternatives": ["替代方案1", "替代方案2"],
      "explanation": "详细解释",
      "location": [0, 0, 0, 0]
    }
  ]
}

待分析：${text}
`;

  const messages: any = [
    {
      role: 'system',
      content: '你是专业的安防行业文案分析专家。'
    },
    {
      role: 'user',
      content: mode === 'image' && image
        ? [
            {
              type: 'image_url',
              image_url: { url: `data:image/png;base64,${image}`, detail: 'high' }
            },
            {
              type: 'text',
              text: systemPrompt
            }
          ]
        : systemPrompt
    }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: mode === 'image' ? 'gpt-4-vision-preview' : 'gpt-4-turbo-preview',
      messages,
      response_format: { type: 'json_object' },
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI analyze failed: ${response.statusText}`);
  }

  const data = await response.json();
  const resultText = data.choices?.[0]?.message?.content;

  if (!resultText) {
    throw new Error('Analysis returned empty response');
  }

  return JSON.parse(resultText);
}

// Claude 分析
async function claudeAnalyze(
  text: string,
  image: string | undefined,
  terminology: any[],
  mode: string,
  apiKey: string
): Promise<DetectionResult> {
  const systemPrompt = `你是专业的安防行业文案分析专家。

标准词库：${JSON.stringify(terminology)}

请分析并返回JSON格式的诊断结果。

待分析文本：${text}
`;

  const content: any = [];

  if (mode === 'image' && image) {
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/png',
        data: image
      }
    });
  }

  content.push({
    type: 'text',
    text: systemPrompt
  });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude analyze failed: ${response.statusText}`);
  }

  const data = await response.json();
  const resultText = data.content?.[0]?.text;

  if (!resultText) {
    throw new Error('Analysis returned empty response');
  }

  // 提取JSON内容
  const jsonMatch = resultText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }

  return JSON.parse(jsonMatch[0]);
}

// 通义千问分析
async function qwenAnalyze(
  text: string,
  image: string | undefined,
  terminology: any[],
  mode: string,
  apiKey: string
): Promise<DetectionResult> {
  const systemPrompt = `你是专业的安防行业文案分析专家。

标准词库：${JSON.stringify(terminology)}

请分析并返回JSON格式。

待分析：${text}
`;

  const messages: any = [
    {
      role: 'system',
      content: '你是专业的安防行业文案分析专家。'
    },
    {
      role: 'user',
      content: mode === 'image' && image
        ? [
            {
              type: 'image',
              image: `data:image/png;base64,${image}`
            },
            {
              type: 'text',
              text: systemPrompt
            }
          ]
        : systemPrompt
    }
  ];

  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: mode === 'image' ? 'qwen-vl-max' : 'qwen-max',
      input: {
        messages
      },
      parameters: {
        result_format: 'message'
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Qwen analyze failed: ${response.statusText}`);
  }

  const data = await response.json();
  const resultText = data.output?.choices?.[0]?.message?.content?.[0]?.text;

  if (!resultText) {
    throw new Error('Analysis returned empty response');
  }

  const jsonMatch = resultText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }

  return JSON.parse(jsonMatch[0]);
}

// DeepSeek 分析
async function deepseekAnalyze(
  text: string,
  image: string | undefined,
  terminology: any[],
  mode: string,
  apiKey: string
): Promise<DetectionResult> {
  const systemPrompt = `你是专业的安防行业文案分析专家。

标准词库：${JSON.stringify(terminology)}

请分析并返回JSON格式的诊断结果。

待分析：${text}
`;

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是专业的安防行业文案分析专家。'
        },
        {
          role: 'user',
          content: systemPrompt
        }
      ],
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek analyze failed: ${response.statusText}`);
  }

  const data = await response.json();
  const resultText = data.choices?.[0]?.message?.content;

  if (!resultText) {
    throw new Error('Analysis returned empty response');
  }

  return JSON.parse(resultText);
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body: AnalyzeRequest = await req.json();
    const { text, image, provider, terminology, mode } = body;

    let result: DetectionResult;

    switch (provider) {
      case 'GEMINI':
        result = await geminiAnalyze(text, image, terminology, mode, process.env.GEMINI_API_KEY || '');
        break;

      case 'DOUBAO':
        result = await doubaoAnalyze(text, image, terminology, mode, process.env.DOUBAO_API_KEY || '');
        break;

      case 'OPENAI':
        result = await openaiAnalyze(text, image, terminology, mode, process.env.OPENAI_API_KEY || '');
        break;

      case 'ANTHROPIC':
        result = await claudeAnalyze(text, image, terminology, mode, process.env.ANTHROPIC_API_KEY || '');
        break;

      case 'QWEN':
        result = await qwenAnalyze(text, image, terminology, mode, process.env.QWEN_API_KEY || '');
        break;

      case 'DEEPSEEK':
        result = await deepseekAnalyze(text, image, terminology, mode, process.env.DEEPSEEK_API_KEY || '');
        break;

      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Analyze Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Analysis failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
