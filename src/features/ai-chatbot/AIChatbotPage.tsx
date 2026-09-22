import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  X,
} from 'lucide-react';
import { AIMessage } from '../../types';
import { askAIHealthAssistant, analyzeMedicalImage, MedicalImageAnalysisResult } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';

interface AIChatbotPageProps {
  onNavigate: (tab: string) => void;
  onSelectDoctor?: (id: string) => void;
}

export const AIChatbotPage: React.FC<AIChatbotPageProps> = ({ onNavigate, onSelectDoctor }) => {
  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'chat' | 'image-triage'>('chat');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I am your **MedConnect AI Assistant**. 🩺\n\nHow can I support your health today? You can:\n- **Attach photos of concerns** (rashes, cuts, etc.) using the 📸 button to detect causes & severity.\n- Ask about symptoms & precautions ("I have a fever", "Symptoms of dengue")\n- Get specialist recommendations\n- Switch to **Medical Image Triage** for a structured clinical report!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      disclaimer: 'This is AI-generated advice and should not replace professional medical diagnosis.',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatAttachedImage, setChatAttachedImage] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  // Image Triage State (Tab 2)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageNotes, setImageNotes] = useState('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MedicalImageAnalysisResult | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, analysisResult, chatAttachedImage]);

  const handleChatImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File Too Large', 'Please upload an image smaller than 5MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setChatAttachedImage(reader.result as string);
      showToast('Image Attached', 'Photo attached. You can now send it for analysis.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && !chatAttachedImage) return;

    const userText = inputValue.trim() || (chatAttachedImage ? 'Please analyze this medical photo for any infection, probable cause, and health guidance.' : '');
    const attachedImg = chatAttachedImage;

    setInputValue('');
    setChatAttachedImage(null);
    if (chatFileInputRef.current) {
      chatFileInputRef.current.value = '';
    }

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      imageUrl: attachedImg || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await askAIHealthAssistant(userText, attachedImg || undefined);

      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedDepartment: response.department,
        disclaimer: 'This is AI-generated advice and should not replace professional medical diagnosis.',
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      showToast('AI Response Error', 'Failed to generate response. Please try again.', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File Too Large', 'Please upload an image smaller than 5MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      showToast('Image Required', 'Please upload a photo of the affected skin area, burn, or injury.', 'warning');
      return;
    }

    setIsAnalyzingImage(true);
    try {
      const result = await analyzeMedicalImage(selectedImage, imageNotes);
      setAnalysisResult(result);
      showToast('Analysis Complete', 'Triage summary generated below.', 'success');
    } catch (err) {
      showToast('Analysis Error', 'Failed to evaluate image. Please try again.', 'error');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const presetQuestions = [
    '📸 Upload skin rash / infection photo',
    '🩹 How to tell if a cut or wound is infected?',
    'I have a migraine headache. What should I do?',
    'My child has a 101°F fever.',
    'What are the symptoms of Dengue?',
    'Which doctor should I consult for chest pain?',
  ];

  const handlePresetClick = (q: string) => {
    if (q.startsWith('📸 Upload')) {
      chatFileInputRef.current?.click();
    } else {
      setInputValue(q);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
      <div className="site-container max-w-5xl space-y-8">
        
        {/* Header Hero */}
        <div
          className="relative overflow-hidden rounded-[var(--r-lg)] p-8 sm:p-10 shadow-[var(--shadow-md)] animate-fade-up"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full pointer-events-none opacity-10"
               style={{ background: 'var(--sage-light)', transform: 'translate(20%, -30%)' }} />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                <Sparkles className="w-3.5 h-3.5" /> AI Vision Engine
              </div>
              <h1 className="display-font" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', color: 'var(--text-primary)' }}>
                MedConnect AI Assistant
              </h1>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Natural language health guidance & intelligent medical image triage.
              </p>
            </div>

            <div className="flex p-1 rounded-xl" style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
              <button
                onClick={() => setActiveTab('chat')}
                className="px-5 py-2.5 rounded-lg text-[11px] font-bold transition-all shadow-sm"
                style={{
                  background: activeTab === 'chat' ? 'var(--bg-surface)' : 'transparent',
                  color: activeTab === 'chat' ? 'var(--green)' : 'var(--text-secondary)',
                }}
              >
                💬 Health Chatbot
              </button>
              <button
                onClick={() => setActiveTab('image-triage')}
                className="px-5 py-2.5 rounded-lg text-[11px] font-bold transition-all shadow-sm"
                style={{
                  background: activeTab === 'image-triage' ? 'var(--bg-surface)' : 'transparent',
                  color: activeTab === 'image-triage' ? 'var(--sage)' : 'var(--text-secondary)',
                }}
              >
                📸 Image Triage
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: AI Health Chatbot */}
        {activeTab === 'chat' && (
          <div className="card flex flex-col h-[700px] overflow-hidden animate-fade-in shadow-[var(--shadow-md)]">
            
            {/* Disclaimer Bar */}
            <div className="px-6 py-3 text-xs font-semibold flex items-center gap-2" style={{ background: 'var(--gold-light)', color: 'var(--gold)', borderBottom: '1px solid rgba(241,216,163,0.3)' }}>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                "This is AI-generated guidance and should not replace professional medical diagnosis."
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6" style={{ background: 'var(--bg-muted)' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[var(--shadow-sm)]" style={{ background: 'var(--green)', color: '#fff' }}>
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-xl space-y-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`p-5 rounded-2xl text-[13px] leading-relaxed inline-block shadow-[var(--shadow-sm)] ${
                        msg.sender === 'user'
                          ? 'rounded-tr-none'
                          : 'rounded-tl-none'
                      }`}
                      style={{
                        background: msg.sender === 'user' ? 'var(--green)' : 'var(--bg-surface)',
                        color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                        border: msg.sender === 'user' ? 'none' : '1px solid var(--border)'
                      }}
                    >
                      {/* Attached Image inside message bubble */}
                      {msg.imageUrl && (
                        <div className="mb-4 overflow-hidden rounded-[var(--r-md)] border">
                          <img
                            src={msg.imageUrl} alt="Attached"
                            onClick={() => setPreviewModalImage(msg.imageUrl || null)}
                            className="max-h-64 max-w-full rounded-t-[var(--r-md)] object-cover cursor-zoom-in hover:opacity-95 transition-opacity"
                          />
                          <div className="px-3 py-2 text-[10px] flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.8)', color: '#fff' }}>
                            <span className="flex items-center gap-1.5 font-semibold">
                              <ImageIcon className="w-3 h-3" /> Medical Photo
                            </span>
                            <span onClick={() => setPreviewModalImage(msg.imageUrl || null)} className="cursor-pointer underline text-[9px]">
                              Expand 🔍
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {msg.suggestedDepartment && (
                        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3" style={{ borderTop: `1px solid ${msg.sender === 'user' ? 'rgba(255,255,255,0.2)' : 'var(--border)'}` }}>
                          <span className="text-[11px] font-bold" style={{ color: msg.sender === 'user' ? '#fff' : 'var(--sage)' }}>
                            Department: {msg.suggestedDepartment}
                          </span>
                          <button
                            onClick={() => onNavigate('doctors')}
                            className="btn btn-sm shadow-[var(--shadow-xs)]"
                            style={{ background: 'var(--sage)', color: '#fff' }}
                          >
                            Find Specialist &rarr;
                          </button>
                        </div>
                      )}
                    </div>

                    {msg.disclaimer && (
                      <p className="text-[10px] italic" style={{ color: 'var(--text-muted)' }}>
                        {msg.disclaimer}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs italic" style={{ color: 'var(--text-muted)' }}>
                  <Bot className="w-4 h-4 animate-spin" style={{ color: 'var(--green)' }} />
                  Gemini analyzing context...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Preset Buttons */}
            <div className="px-6 py-3 flex gap-3 overflow-x-auto" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
              {presetQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handlePresetClick(q)}
                  className={`px-4 py-2 rounded-full border text-[11px] font-bold whitespace-nowrap transition-all ${
                    q.startsWith('📸')
                      ? 'shadow-[var(--shadow-sm)]'
                      : 'hover:shadow-[var(--shadow-sm)]'
                  }`}
                  style={{
                    background: q.startsWith('📸') ? 'var(--green-light)' : 'var(--bg-muted)',
                    color: q.startsWith('📸') ? 'var(--green)' : 'var(--text-secondary)',
                    borderColor: q.startsWith('📸') ? 'transparent' : 'var(--border)',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Image Preview Bar when image is attached but not yet sent */}
            {chatAttachedImage && (
              <div className="px-6 py-3 flex items-center justify-between gap-3" style={{ background: 'var(--green-light)', borderTop: '1px solid var(--border)' }}>
                <div className="flex items-center gap-4 min-w-0">
                  <img src={chatAttachedImage} alt="Preview" className="w-12 h-12 rounded-[var(--r-md)] object-cover border-2 shadow-sm" style={{ borderColor: 'var(--green)' }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--green)' }}>
                      <Sparkles className="w-3.5 h-3.5" /> Photo Attached
                    </div>
                    <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                      AI will inspect for infections, causes & care guidance.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setChatAttachedImage(null);
                    if (chatFileInputRef.current) chatFileInputRef.current.value = '';
                  }}
                  className="btn-icon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 sm:p-5 flex items-center gap-3" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
              {/* Hidden file input */}
              <input
                ref={chatFileInputRef} type="file" accept="image/*"
                onChange={handleChatImageUpload} className="hidden" id="chat-image-input"
              />
              <label
                htmlFor="chat-image-input"
                className="p-3 rounded-[var(--r-md)] cursor-pointer transition-colors flex items-center justify-center shrink-0"
                style={{
                  background: chatAttachedImage ? 'var(--green-light)' : 'var(--bg-muted)',
                  color: chatAttachedImage ? 'var(--green)' : 'var(--text-muted)'
                }}
              >
                <ImageIcon className="w-5 h-5" />
              </label>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  chatAttachedImage
                    ? 'Add description (optional)...'
                    : 'Ask about symptoms, or attach an image...'
                }
                className="input-base flex-1 py-4 text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() && !chatAttachedImage}
                className="btn btn-primary py-4 px-6 disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Medical Image Analysis */}
        {activeTab === 'image-triage' && (
          <div className="space-y-8 animate-fade-in">
            <div className="card p-8 sm:p-12 space-y-8 shadow-[var(--shadow-md)]">
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <ImageIcon className="w-6 h-6" style={{ color: 'var(--sage)' }} /> AI Image Triage
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Upload a clear photograph of an injury, rash, swelling, or cut. Gemini AI evaluates visual indicators to generate clinical triage advice.
                </p>
              </div>

              <form onSubmit={handleAnalyzeImageSubmit} className="space-y-8">
                
                {/* Image Upload Box */}
                <div className="border-2 border-dashed rounded-[var(--r-lg)] p-8 sm:p-12 text-center transition-colors hover:opacity-80" style={{ borderColor: 'var(--border)', background: 'var(--bg-muted)' }}>
                  {selectedImage ? (
                    <div className="relative inline-block">
                      <img src={selectedImage} alt="Uploaded condition" className="max-h-64 rounded-[var(--r-md)] shadow-lg mx-auto object-contain" />
                      <button
                        type="button" onClick={() => setSelectedImage(null)}
                        className="absolute -top-3 -right-3 p-2 text-white rounded-full shadow-lg"
                        style={{ background: 'var(--red)' }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-4">
                      <Upload className="w-12 h-12 animate-pulse" style={{ color: 'var(--sage)' }} />
                      <div>
                        <span className="text-sm font-bold block" style={{ color: 'var(--text-primary)' }}>Click to Upload Condition Image</span>
                        <span className="text-xs block mt-1" style={{ color: 'var(--text-muted)' }}>Supports JPG, PNG (Max 5MB)</span>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Symptoms / Context
                  </label>
                  <input
                    type="text" value={imageNotes} onChange={(e) => setImageNotes(e.target.value)}
                    placeholder="e.g. Scalding hot water burn on forearm 2 hours ago..."
                    className="input-base py-4 text-sm"
                  />
                </div>

                <button
                  type="submit" disabled={!selectedImage || isAnalyzingImage}
                  className="btn btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isAnalyzingImage ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate Triage Report
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Analysis Results Display Card */}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                className="card p-8 sm:p-10 space-y-8 shadow-[var(--shadow-md)] border-t-4"
                style={{ borderTopColor: 'var(--sage)' }}
              >
                {/* Alert Disclaimer Header */}
                <div className="p-4 rounded-[var(--r-md)] border text-xs font-semibold space-y-1" style={{ background: 'var(--gold-light)', color: 'var(--gold)', borderColor: 'rgba(241,216,163,0.3)' }}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> AI-Generated Triage Report
                  </div>
                  <p className="text-[10px]">{analysisResult.disclaimer}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Possible Conditions */}
                  <div className="p-6 rounded-[var(--r-md)] space-y-4" style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
                    <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Evaluated Conditions</h4>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {analysisResult.possibleConditions.map((cond, i) => (
                        <li key={i} className="flex items-start gap-2 font-medium">
                          <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--sage)' }} /> {cond}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 mt-2 flex justify-between items-center text-xs" style={{ borderTop: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Severity Level:</span>
                      <strong className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide" style={{
                        background: analysisResult.severity.includes('Emergency') ? 'var(--red-light)' : 'var(--green-light)',
                        color: analysisResult.severity.includes('Emergency') ? 'var(--red)' : 'var(--green)'
                      }}>
                        {analysisResult.severity}
                      </strong>
                    </div>
                  </div>

                  {/* Recommended Doctor */}
                  <div className="p-6 rounded-[var(--r-md)] space-y-4 flex flex-col justify-between" style={{ background: 'var(--green-light)' }}>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green)' }}>Recommended Consultation</h4>
                      <p className="text-xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{analysisResult.recommendedSpecialization}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('doctors')}
                      className="btn btn-primary py-3 px-5 text-xs flex items-center justify-center gap-2 mt-4"
                      style={{ background: 'var(--green)', color: '#fff' }}
                    >
                      Book Specialist <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Precautions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Home Remedies & Care</h4>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {analysisResult.homeRemedies.map((rem, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--green)' }} />
                          <span>{rem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Do Not Do</h4>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {analysisResult.basicPrecautions.map((prec, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                          <span>{prec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Emergency Warning Signs */}
                <div className="p-5 rounded-[var(--r-md)] space-y-3" style={{ background: 'var(--red-light)', border: '1px solid rgba(212,106,96,0.2)' }}>
                  <h4 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--red)' }}>
                    <AlertTriangle className="w-4 h-4" /> Seek ER Emergency Care If:
                  </h4>
                  <ul className="list-disc pl-6 space-y-1.5 text-sm font-medium" style={{ color: 'var(--red)' }}>
                    {analysisResult.emergencyWarningSigns.map((sign, i) => (
                      <li key={i}>{sign}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        )}

      </div>

      {/* Enlarged Image Lightbox Modal */}
      {previewModalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all"
          style={{ background: 'rgba(11,17,16,0.9)' }}
          onClick={() => setPreviewModalImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] rounded-[var(--r-lg)] overflow-hidden shadow-2xl p-2 sm:p-4"
            style={{ background: 'var(--bg-surface)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 px-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <ImageIcon className="w-4 h-4" style={{ color: 'var(--sage)' }} /> Image Viewer
              </span>
              <button
                type="button" onClick={() => setPreviewModalImage(null)}
                className="btn-icon" title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="pt-4 flex items-center justify-center">
              <img
                src={previewModalImage} alt="Enlarged"
                className="max-h-[75vh] w-auto max-w-full rounded-[var(--r-md)] object-contain shadow-[var(--shadow-md)]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
