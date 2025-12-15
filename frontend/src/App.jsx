import { useState } from 'react';
import axios from 'axios';
import { Scale, ArrowRight, Copy, Check, Zap, BookOpen, Gavel } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use your deployed URL or local
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/translate";

  const handleTranslate = async () => {
    if (!inputText) return;
    setIsLoading(true);
    try {
      const response = await axios.post(BACKEND_URL, { text: inputText });
      if (response.data.translated_text) {
        setTranslatedText(response.data.translated_text);
      } else if (response.data.error) {
        setTranslatedText("Model is warming up... please wait 20s and try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setTranslatedText("Error connecting to server.");
    }
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Navbar */}
      <nav className="w-full border-b border-stone-200 bg-[#FDFBF7]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-900 rounded text-white">
              <Scale className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-stone-900">Legalis<span className="text-emerald-700">Translate</span></span>
          </div>
          <div className="text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
            NLLB-200 • LoRA Optimized
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center gap-16">
        
        {/* 1. Centered Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl relative"
        >
          {/* Decorative Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[80px] -z-10" />
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 tracking-tight mb-6">
            Legal AI, 
            <span className="text-emerald-800"> Decoded.</span>
          </h1>
          <p className="text-xl text-stone-500 leading-relaxed">
            Translate complex English <em>"Legalese"</em> into formal <span className="font-semibold text-emerald-800">Vidhik Hindi</span> with high terminological precision.
          </p>
        </motion.div>

        {/* 2. The Playground (Card Style) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full grid grid-cols-1 lg:grid-cols-2 shadow-2xl shadow-stone-200 rounded-2xl overflow-hidden border border-stone-200 bg-white"
        >
          
          {/* Input Side */}
          <div className="p-8 border-b lg:border-b-0 lg:border-r border-stone-100 flex flex-col gap-4 bg-white">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Source (English)</label>
            <textarea
              className="flex-1 bg-transparent border-none focus:ring-0 text-stone-800 text-lg placeholder:text-stone-300 resize-none h-64 outline-none font-medium"
              placeholder="Enter legal text (e.g., 'The magistrate rejected the bail application...')"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
              <span className="text-xs text-stone-400">{inputText.length} chars</span>
              <button
                onClick={handleTranslate}
                disabled={isLoading}
                className="bg-emerald-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-900/20"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Translating...
                  </span>
                ) : (
                  <>Translate <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>

          {/* Output Side */}
          <div className="p-8 bg-stone-50/50 flex flex-col gap-4 relative">
            <label className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Target (Hindi)</label>
            <div className="flex-1 text-lg text-stone-800 leading-relaxed font-medium">
              {isLoading ? (
                <div className="animate-pulse space-y-3 mt-2">
                  <div className="h-2 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-2 bg-stone-200 rounded w-1/2"></div>
                  <div className="h-2 bg-stone-200 rounded w-5/6"></div>
                </div>
              ) : (
                translatedText || <span className="text-stone-300 italic">Translation results will appear here...</span>
              )}
            </div>
            
            {translatedText && (
              <button 
                onClick={copyToClipboard}
                className="absolute top-6 right-6 p-2 rounded-md hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </motion.div>

        {/* 3. Implementation Context (Clean Cards) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8"
        >
          <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-bold text-stone-900 mb-2">Fine-Tuned (LoRA)</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Adapted using <strong>Low-Rank Adaptation</strong>. We froze 98% of the NLLB model and only trained 9M parameters to specialize in legal syntax.
            </p>
          </div>

          <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-orange-700" />
            </div>
            <h3 className="font-bold text-stone-900 mb-2">Samanantar Corpus</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Trained on high-quality filtered data from the <strong>AI4Bharat Samanantar</strong> dataset (Governance & PIB subsets).
            </p>
          </div>

          <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Gavel className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="font-bold text-stone-900 mb-2">Legal Precision</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Achieved a <strong>BLEU score of 25.03</strong>, effectively learning terms like <em>"Adhiniyam"</em> (Act) and <em>"Yachika"</em> (Petition).
            </p>
          </div>
        </motion.div>

      </main>

      {/* Simple Footer */}
      <footer className="w-full text-center py-8 text-stone-400 text-sm border-t border-stone-200 bg-white">
        <p>End Semester Project • NLLB-200 • 2024</p>
      </footer>
    </div>
  );
}

export default App;