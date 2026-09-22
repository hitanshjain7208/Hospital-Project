import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  HeartPulse,
  Sparkles,
  ShieldCheck,
  User,
  RefreshCw,
  ChevronRight,
  Stethoscope,
  Building2,
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

  const [activeTab, setActiveTab] = useState<'chat' | 'image-triage'>('chat');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I am **MedConnect AI Assistant** powered by Gemini. 🩺\n\nHow can I help you today? You can ask me about:\n- Symptoms & basic health precautions ("I have a headache", "Symptoms of dengue")\n- Department & doctor recommendations\n- Prescription & medical report explanations\n- Or switch to **Medical Image Analysis** above to evaluate skin rashes, burns, cuts, or swelling!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      disclaimer: 'This is AI-generated advice and should not replace professional medical diagnosis.',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Image Triage State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageNotes, setImageNotes] = useState('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MedicalImageAnalysisResult | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, analysisResult]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await askAIHealthAssistant(userText);

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
      showToast('Medical Image Analysis Complete', 'Gemini Vision triage summary generated below.', 'success');
    } catch (err) {
      showToast('Analysis Error', 'Failed to evaluate image. Please try again.', 'error');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const presetQuestions = [
    'I have a migraine headache. What should I do?',
    'My child has a 101°F fever.',
    'What are the symptoms of Dengue?',
    'Which doctor should I consult for chest pain?',
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Gemini 1.5/2.0 Vision Triage Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">MedConnect AI Healthcare Assistant</h1>
            <p className="text-sky-100 text-xs">
              Natural language health assistant & multi-modal medical image triage unit.
            </p>
          </div>

          <div className="flex p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'chat' ? 'bg-white text-sky-700 shadow-md' : 'text-white/80 hover:text-white'
              }`}
            >
              💬 Health Chatbot
            </button>
            <button
              onClick={() => setActiveTab('image-triage')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'image-triage' ? 'bg-white text-teal-700 shadow-md' : 'text-white/80 hover:text-white'
              }`}
            >
              📸 Medical Image Triage
            </button>
          </div>
        </div>

        {/* Tab 1: AI Health Chatbot */}
        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col h-[650px] overflow-hidden">
            
            {/* Disclaimer Bar */}
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 text-xs text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 animate-pulse" />
              <span>
                "This is AI-generated advice and should not replace professional medical diagnosis."
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div className={`max-w-xl space-y-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed inline-block shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-sky-600 text-white rounded-tr-none font-medium'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {msg.suggestedDepartment && (
                        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
                            Department: {msg.suggestedDepartment}
                          </span>
                          <button
                            onClick={() => onNavigate('doctors')}
                            className="px-2.5 py-1 rounded-lg bg-sky-600 text-white text-[10px] font-bold hover:bg-sky-700"
                          >
                            Find {msg.suggestedDepartment} Specialist →
                          </button>
                        </div>
                      )}
                    </div>

                    {msg.disclaimer && (
                      <p className="text-[9px] text-slate-400 font-mono italic">
                        {msg.disclaimer}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                  <Bot className="w-4 h-4 animate-spin text-sky-500" />
                  Gemini API synthesizing medical guidance...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Preset Buttons */}
            <div className="px-6 py-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto">
              {presetQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInputValue(q)}
                  className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 whitespace-nowrap shadow-xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about symptoms, medicines, nearest cardiologist, dengue..."
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="py-3 px-5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Medical Image Analysis (Injuries, Skin infections, Swelling, Burns, Cuts, Rashes) */}
        {activeTab === 'image-triage' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-teal-500" /> AI Medical Image Analysis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload a clear photograph of an injury, skin rash, swelling, burn, or cut. Gemini Vision evaluates visual indicators and generates clinical triage advice.
                </p>
              </div>

              <form onSubmit={handleAnalyzeImageSubmit} className="space-y-6">
                
                {/* Image Upload Box */}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/50 transition-colors">
                  {selectedImage ? (
                    <div className="relative inline-block">
                      <img src={selectedImage} alt="Uploaded medical condition" className="max-h-64 rounded-xl shadow-lg border border-slate-300 dark:border-slate-700 mx-auto" />
                      <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full shadow"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer space-y-2 block">
                      <Upload className="w-10 h-10 mx-auto text-teal-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Click to Upload Injury / Skin Image</span>
                      <span className="text-[11px] text-slate-400 block">Supports JPG, PNG, WEBP (Max 5MB)</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Describe Symptoms / How long has this condition persisted?
                  </label>
                  <input
                    type="text"
                    value={imageNotes}
                    onChange={(e) => setImageNotes(e.target.value)}
                    placeholder="e.g. Scalding hot water burn on forearm 2 hours ago..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedImage || isAnalyzingImage}
                  className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2"
                >
                  {isAnalyzingImage ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Image with Gemini AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Analyze Medical Image & Generate Triage Report
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Analysis Results Display Card */}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl"
              >
                {/* Alert Disclaimer Header */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> AI-Generated Medical Triage Report
                  </div>
                  <p className="text-[11px]">{analysisResult.disclaimer}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Possible Conditions */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Possible Evaluated Conditions
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {analysisResult.possibleConditions.map((cond, i) => (
                        <li key={i} className="flex items-center gap-2 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-teal-500" /> {cond}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Severity Level:</span>
                      <strong className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        analysisResult.severity.includes('Emergency') ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'
                      }`}>
                        {analysisResult.severity}
                      </strong>
                    </div>
                  </div>

                  {/* Recommended Doctor Specialization */}
                  <div className="p-5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                        Recommended Specialist Consultation
                      </h4>
                      <p className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                        {analysisResult.recommendedSpecialization}
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('doctors')}
                      className="py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                    >
                      Book {analysisResult.recommendedSpecialization} Doctor <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Home Remedies & Basic Precautions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Recommended Home Remedies & Immediate Care
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {analysisResult.homeRemedies.map((rem, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{rem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Basic Precautions (Do Not Do)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {analysisResult.basicPrecautions.map((prec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{prec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Emergency Warning Signs */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs space-y-2">
                  <h4 className="font-bold uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" /> Seek Immediate ER Emergency Care If:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
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
    </div>
  );
};
