/**
 * API连接测试工具
 * 用于测试各个API服务是否正常工作
 */

export const config = {
  runtime: 'edge',
};

const testProviders = {
  gemini: async (apiKey: string) => {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }]
        })
      }
    );
    return response.ok;
  },

  doubao: async (apiKey: string) => {
    const response = await fetch(
      'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'doubao-pro-32k',
          messages: [{ role: 'user', content: 'Hello' }]
        })
      }
    );
    return response.ok;
  },

  openai: async (apiKey: string) => {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello' }]
        })
      }
    );
    return response.ok;
  }
};

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const results: any = {
    timestamp: new Date().toISOString(),
    services: {}
  };

  // 测试Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      results.services.gemini = {
        configured: true,
        working: await testProviders.gemini(process.env.GEMINI_API_KEY)
      };
    } catch (e) {
      results.services.gemini = { configured: true, working: false, error: String(e) };
    }
  } else {
    results.services.gemini = { configured: false };
  }

  // 测试豆包
  if (process.env.DOUBAO_API_KEY) {
    try {
      results.services.doubao = {
        configured: true,
        working: await testProviders.doubao(process.env.DOUBAO_API_KEY)
      };
    } catch (e) {
      results.services.doubao = { configured: true, working: false, error: String(e) };
    }
  } else {
    results.services.doubao = { configured: false };
  }

  // 测试OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      results.services.openai = {
        configured: true,
        working: await testProviders.openai(process.env.OPENAI_API_KEY)
      };
    } catch (e) {
      results.services.openai = { configured: true, working: false, error: String(e) };
    }
  } else {
    results.services.openai = { configured: false };
  }

  // 其他服务简单标记是否配置
  results.services.anthropic = { configured: !!process.env.ANTHROPIC_API_KEY };
  results.services.qwen = { configured: !!process.env.QWEN_API_KEY };
  results.services.deepseek = { configured: !!process.env.DEEPSEEK_API_KEY };
  results.services.baidu = { 
    configured: !!(process.env.BAIDU_API_KEY && process.env.BAIDU_SECRET_KEY) 
  };
  results.services.alibaba = { configured: !!process.env.ALIBABA_API_KEY };

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}
