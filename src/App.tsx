import React, { useState, useRef } from 'react';
import { OCRProvider, LLMProvider, ProcessedImage, SecurityTerm, DetectionError } from './types';
import { INITIAL_TERMINOLOGY } from './constants';
import { performOCR, analyzeImage, analyzeText, fileToBase64 } from './services/apiService';
import './App.css';

const SCAN_MESSAGES = [
  "正在初始化 AI 核心视觉神经...",
  "深度探测图片文本图层...",
  "匹配 2026 行业标准库...",
  "逻辑建模与拼写上下文校验...",
  "评估 brand 溢价与表达专业度...",
  "生成多维度诊断分析结果..."
];

const App: React.FC = () => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [terminology, setTerminology] = useState<SecurityTerm[]>(INITIAL_TERMINOLOGY);
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  const [textInput, setTextInput] = useState('');
  
  const [ocrProvider, setOcrProvider] = useState<OCRProvider>(OCRProvider.GEMINI);
  const [llmProvider, setLlmProvider] = useState<LLMProvider>(LLMProvider.GEMINI);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [scanMessage, setScanMessage] = useState('');
  const [textAnalysisResult, setTextAnalysisResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ProcessedImage[] = files.map(file => ({
      id: Date.now().toString() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  // 处理图片分析
  const handleAnalyzeImages = async () => {
    setIsProcessing(true);
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      setScanMessage(SCAN_MESSAGES[messageIndex]);
      messageIndex = (messageIndex + 1) % SCAN_MESSAGES.length;
    }, 2000);

    try {
      for (let i = 0; i < images.length; i++) {
        if (images[i].status !== 'pending') continue;

        setCurrentIndex(i);
        setImages(prev => prev.map((img, idx) => 
          idx === i ? { ...img, status: 'processing' as const } : img
        ));

        try {
          // 1. 转换图片为base64
          const base64Image = await fileToBase64(images[i].file);

          // 2. OCR识别
          setScanMessage('正在进行OCR文字识别...');
          const extractedText = await performOCR(base64Image, ocrProvider);

          setImages(prev => prev.map((img, idx) => 
            idx === i ? { ...img, rawOcrText: extractedText } : img
          ));

          // 3. AI分析
          setScanMessage('正在进行AI智能分析...');
          const analysis = await analyzeImage(extractedText, base64Image, llmProvider, terminology);

          setImages(prev => prev.map((img, idx) => 
            idx === i ? { 
              ...img, 
              status: 'completed' as const,
              result: analysis
            } : img
          ));

        } catch (error: any) {
          console.error('分析错误:', error);
          setImages(prev => prev.map((img, idx) => 
            idx === i ? { 
              ...img, 
              status: 'error' as const,
              errorMessage: error.message
            } : img
          ));
        }
      }
    } finally {
      clearInterval(messageInterval);
      setIsProcessing(false);
      setCurrentIndex(null);
      setScanMessage('');
    }
  };

  // 处理文本分析
  const handleAnalyzeText = async () => {
    if (!textInput.trim()) {
      alert('请输入要分析的文本');
      return;
    }

    setIsProcessing(true);
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      setScanMessage(SCAN_MESSAGES[messageIndex]);
      messageIndex = (messageIndex + 1) % SCAN_MESSAGES.length;
    }, 2000);

    try {
      const result = await analyzeText(textInput, llmProvider, terminology);
      setTextAnalysisResult(result);
    } catch (error: any) {
      alert('分析失败: ' + error.message);
    } finally {
      clearInterval(messageInterval);
      setIsProcessing(false);
      setScanMessage('');
    }
  };

  // 渲染错误徽章
  const renderErrorBadge = (type: string) => {
    const labels: Record<string, string> = {
      spelling: '拼写',
      grammar: '语法',
      terminology: '术语',
      style: '风格'
    };
    return labels[type] || type;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🛡️ GuardVision AI 海报检查器</h1>
        <p>专业安防行业文案诊断工具</p>
      </header>

      <div className="container">
        {/* 模式切换 */}
        <div className="tabs">
          <button 
            className={activeTab === 'image' ? 'active' : ''}
            onClick={() => setActiveTab('image')}
          >
            📷 图片分析
          </button>
          <button 
            className={activeTab === 'text' ? 'active' : ''}
            onClick={() => setActiveTab('text')}
          >
            📝 文本分析
          </button>
        </div>

        {/* 配置区域 */}
        <div className="config-panel">
          <div className="config-row">
            <label>
              OCR服务:
              <select 
                value={ocrProvider} 
                onChange={(e) => setOcrProvider(e.target.value as OCRProvider)}
              >
                <option value={OCRProvider.GEMINI}>Google Gemini</option>
                <option value={OCRProvider.DOUBAO}>字节豆包</option>
                <option value={OCRProvider.BAIDU}>百度OCR</option>
                <option value={OCRProvider.ALIBABA}>阿里云OCR</option>
                <option value={OCRProvider.OPENAI}>OpenAI Vision</option>
              </select>
            </label>

            <label>
              AI分析:
              <select 
                value={llmProvider} 
                onChange={(e) => setLlmProvider(e.target.value as LLMProvider)}
              >
                <option value={LLMProvider.GEMINI}>Google Gemini</option>
                <option value={LLMProvider.DOUBAO}>字节豆包</option>
                <option value={LLMProvider.OPENAI}>OpenAI GPT-4</option>
                <option value={LLMProvider.ANTHROPIC}>Anthropic Claude</option>
                <option value={LLMProvider.QWEN}>阿里通义千问</option>
                <option value={LLMProvider.DEEPSEEK}>DeepSeek</option>
              </select>
            </label>
          </div>
        </div>

        {/* 图片模式 */}
        {activeTab === 'image' && (
          <div className="image-mode">
            <div className="upload-area">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button 
                className="upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                📁 选择图片
              </button>
              {images.length > 0 && (
                <button 
                  className="analyze-btn"
                  onClick={handleAnalyzeImages}
                  disabled={isProcessing}
                >
                  {isProcessing ? '⏳ 分析中...' : '🚀 开始分析'}
                </button>
              )}
            </div>

            {isProcessing && scanMessage && (
              <div className="scan-message">{scanMessage}</div>
            )}

            <div className="images-grid">
              {images.map((img, idx) => (
                <div key={img.id} className={`image-card ${img.status}`}>
                  <img src={img.preview} alt={`预览 ${idx + 1}`} />
                  <div className="image-status">
                    {img.status === 'pending' && '⏸️ 等待处理'}
                    {img.status === 'processing' && '⏳ 处理中...'}
                    {img.status === 'completed' && `✅ 完成 (得分: ${img.result?.score})`}
                    {img.status === 'error' && `❌ 错误: ${img.errorMessage}`}
                  </div>
                  
                  {img.result && (
                    <div className="result-summary">
                      <div className="errors-count">
                        发现 {img.result.errors.length} 个问题
                      </div>
                      {img.result.errors.map((error, errIdx) => (
                        <div key={errIdx} className="error-item">
                          <span className={`error-badge ${error.type}`}>
                            {renderErrorBadge(error.type)}
                          </span>
                          <div className="error-text">
                            <strong>{error.text}</strong> → {error.suggestion}
                          </div>
                          <div className="error-explanation">
                            {error.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 文本模式 */}
        {activeTab === 'text' && (
          <div className="text-mode">
            <textarea
              className="text-input"
              placeholder="在此输入要分析的安防产品文案..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={10}
            />
            <button 
              className="analyze-btn"
              onClick={handleAnalyzeText}
              disabled={isProcessing || !textInput.trim()}
            >
              {isProcessing ? '⏳ 分析中...' : '🚀 开始分析'}
            </button>

            {isProcessing && scanMessage && (
              <div className="scan-message">{scanMessage}</div>
            )}

            {textAnalysisResult && (
              <div className="text-result">
                <h3>分析结果</h3>
                <div className="result-header">
                  <div>专业度: {textAnalysisResult.isProfessional ? '✅ 专业' : '⚠️ 需改进'}</div>
                  <div>得分: {textAnalysisResult.score}/100</div>
                </div>
                
                <div className="errors-list">
                  <h4>发现 {textAnalysisResult.errors.length} 个问题：</h4>
                  {textAnalysisResult.errors.map((error: DetectionError, idx: number) => (
                    <div key={idx} className="error-item">
                      <span className={`error-badge ${error.type}`}>
                        {renderErrorBadge(error.type)}
                      </span>
                      <div className="error-text">
                        <strong>{error.text}</strong> → {error.suggestion}
                      </div>
                      <div className="error-explanation">
                        {error.explanation}
                      </div>
                      {error.alternatives.length > 0 && (
                        <div className="alternatives">
                          其他建议: {error.alternatives.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>© 2026 GuardVision AI - 由多模态AI驱动</p>
      </footer>
    </div>
  );
};

export default App;
