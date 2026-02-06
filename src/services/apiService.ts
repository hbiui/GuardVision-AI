/**
 * 前端API服务 - 调用Vercel Serverless Functions
 */

import axios from 'axios';
import { DetectionResult, SecurityTerm } from '../types';

const API_BASE = '/api';

/**
 * OCR文字识别
 */
export async function performOCR(
  image: string,
  provider: string,
  language?: string
): Promise<string> {
  try {
    const response = await axios.post(`${API_BASE}/ocr`, {
      image,
      provider,
      language
    });
    return response.data.text;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'OCR识别失败');
  }
}

/**
 * AI分析 - 图片模式
 */
export async function analyzeImage(
  text: string,
  image: string,
  provider: string,
  terminology: SecurityTerm[]
): Promise<DetectionResult> {
  try {
    const response = await axios.post(`${API_BASE}/analyze`, {
      text,
      image,
      provider,
      terminology,
      mode: 'image'
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'AI分析失败');
  }
}

/**
 * AI分析 - 纯文本模式
 */
export async function analyzeText(
  text: string,
  provider: string,
  terminology: SecurityTerm[]
): Promise<DetectionResult> {
  try {
    const response = await axios.post(`${API_BASE}/analyze`, {
      text,
      provider,
      terminology,
      mode: 'text'
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'AI分析失败');
  }
}

/**
 * 将File转换为base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 测试API连接
 */
export async function testConnection(provider: string): Promise<boolean> {
  try {
    const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    await performOCR(testImage, provider);
    return true;
  } catch {
    return false;
  }
}
