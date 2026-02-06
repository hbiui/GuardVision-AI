/**
 * Vercel Serverless Function - OCR识别
 * 支持多厂商OCR服务
 */

export const config = {
  runtime: 'edge',
  maxDuration: 60,
};

interface OCRRequest {
  image: string; // base64
  provider: string;
  language?: string;
}

// Gemini OCR
async function geminiOCR(image: string, apiKey: string): Promise<string> {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: 'image/png',
              data: image
            }
          },
          {
            text: '请提取这张图片中的所有文字内容，按原样输出，不要添加任何解释或格式化。'
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini OCR failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// 豆包OCR（火山引擎）
async function doubaoOCR(image: string, apiKey: string): Promise<string> {
  const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'doubao-vision-pro-32k',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${image}`
            }
          },
          {
            type: 'text',
            text: '请提取这张图片中的所有文字内容，按原样输出，不要添加任何解释。'
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Doubao OCR failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// 百度OCR
async function baiduOCR(image: string, apiKey: string, secretKey: string): Promise<string> {
  // 1. 获取access_token
  const tokenResponse = await fetch(
    `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
    { method: 'POST' }
  );
  
  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // 2. 调用通用文字识别
  const response = await fetch(
    `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${accessToken}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `image=${encodeURIComponent(image)}`
    }
  );

  if (!response.ok) {
    throw new Error(`Baidu OCR failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.words_result?.map((item: any) => item.words).join('\n') || '';
}

// 阿里云OCR
async function alibabaOCR(image: string, apiKey: string, secretKey: string): Promise<string> {
  // 使用阿里云OCR API
  const response = await fetch('https://ocr-api.cn-shanghai.aliyuncs.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `APPCODE ${apiKey}`
    },
    body: JSON.stringify({
      image: image,
      configure: {
        min_size: 16,
        output_prob: false
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Alibaba OCR failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.prism_wordsInfo?.map((item: any) => item.word).join('\n') || '';
}

// OpenAI Vision OCR
async function openaiOCR(image: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4-vision-preview',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${image}`
            }
          },
          {
            type: 'text',
            text: '请提取这张图片中的所有文字内容，按原样输出。'
          }
        ]
      }],
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI OCR failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body: OCRRequest = await req.json();
    const { image, provider, language } = body;

    let text = '';
    
    switch (provider) {
      case 'GEMINI':
        text = await geminiOCR(image, process.env.GEMINI_API_KEY || '');
        break;
        
      case 'DOUBAO':
        text = await doubaoOCR(image, process.env.DOUBAO_API_KEY || '');
        break;
        
      case 'BAIDU':
        text = await baiduOCR(
          image, 
          process.env.BAIDU_API_KEY || '',
          process.env.BAIDU_SECRET_KEY || ''
        );
        break;
        
      case 'ALIBABA':
        text = await alibabaOCR(
          image,
          process.env.ALIBABA_API_KEY || '',
          process.env.ALIBABA_SECRET_KEY || ''
        );
        break;
        
      case 'OPENAI':
        text = await openaiOCR(image, process.env.OPENAI_API_KEY || '');
        break;
        
      default:
        throw new Error(`Unsupported OCR provider: ${provider}`);
    }

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('OCR Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'OCR processing failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
