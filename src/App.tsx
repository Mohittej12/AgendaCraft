/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, LayoutPanelTop, Sparkles, FileText } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { AgendaDisplay } from './components/AgendaDisplay';
import { generateAgenda } from './services/geminiService';
import { MeetingAgenda } from './types';

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalTime, setTotalTime] = useState(60);
  const [agenda, setAgenda] = useState<MeetingAgenda | null>(null);

  const handleContentExtracted = async (content: string, fileName: string) => {
    setIsProcessing(true);
    try {
      const generatedAgenda = await generateAgenda(content, totalTime);
      setAgenda(generatedAgenda);
    } catch (error) {
      console.error("Failed to generate agenda:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setAgenda(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-paper font-sans text-ink selection:bg-neutral-200">
      <main className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {!agenda ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto px-6 py-24 md:py-32"
            >
              <div className="border-b border-ink/20 pb-16 mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="max-w-2xl">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 mb-4 block">
                      Meeting Architecture System v4.1
                    </span>
                    <h1 className="text-7xl md:text-9xl font-serif italic font-light tracking-tighter leading-none mb-8">
                      AgendaCraft
                    </h1>
                    <p className="text-xl text-ink/60 font-medium leading-relaxed max-w-lg">
                      Synthesis of documentation into structural meeting sequences. 
                      Timed. Actionable. Professional.
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-5xl md:text-6xl font-serif mb-1 italic">
                      {totalTime}
                      <span className="text-xs uppercase tracking-widest ml-2 not-italic font-sans font-bold opacity-40">Min</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Allocated Session Time</span>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-start">
                <div className="space-y-12">
                  <div className="space-y-6">
                    <label className="block text-[11px] uppercase tracking-[0.3em] font-bold text-ink/40">
                      I. Configure Temporal Duration
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="180"
                      step="15"
                      value={totalTime}
                      onChange={(e) => setTotalTime(parseInt(e.target.value))}
                      className="w-full h-1 bg-ink/10 accent-ink rounded-none appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono opacity-40 uppercase tracking-tighter">
                      <span>15 Min</span>
                      <span>90 Min</span>
                      <span>180 Min</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="block text-[11px] uppercase tracking-[0.3em] font-bold text-ink/40">
                      II. Source Document Import
                    </label>
                    <FileUpload 
                      onContentExtracted={handleContentExtracted} 
                      isProcessing={isProcessing} 
                    />
                  </div>
                </div>

                <div className="hidden lg:block space-y-12 pt-8">
                  <div className="border-l border-ink/10 pl-8 space-y-12">
                    {[
                      { icon: FileText, title: "Markdown/Docx Support", desc: "Automated text extraction from disparate source types." },
                      { icon: LayoutPanelTop, title: "Temporal Logic", desc: "Algorithmic distribution of minutes across topic nodes." },
                      { icon: Sparkles, title: "Gemini Synthesis", desc: "Advanced semantic analysis for objective identification." }
                    ].map((feature, i) => (
                      <div key={i} className="space-y-2">
                        <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-ink">{feature.title}</h3>
                        <p className="text-sm text-ink/50 leading-relaxed">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="agenda"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AgendaDisplay agenda={agenda} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="h-16 bg-ink text-paper flex items-center px-12 justify-between text-[10px] uppercase tracking-[0.4em] font-medium sticky bottom-0 z-50">
        <div>© 2026 AI Studio Build</div>
        <div className="hidden sm:block">Meeting Architecture Protocol v4.1</div>
      </footer>
    </div>
  );
}
