/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, Users, ListFilter, ArrowLeft, Download, CheckSquare } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { MeetingAgenda } from '../types';

interface AgendaDisplayProps {
  agenda: MeetingAgenda;
  onReset: () => void;
}

export const AgendaDisplay: React.FC<AgendaDisplayProps> = ({ agenda, onReset }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  // Calculate cumulative time for the timeline effect
  let currentTime = 0;

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-neutral-200">
      {/* Editorial Header */}
      <header className="border-b border-ink/20 p-8 md:p-12 flex flex-col md:flex-row justify-between items-end gap-6 bg-paper sticky top-0 z-20">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3 opacity-60 flex items-center gap-2">
            <ArrowLeft className="w-3 h-3 cursor-pointer hover:opacity-100" onClick={onReset} />
            Meeting Architecture System v4.1
          </span>
          <h1 className="text-5xl md:text-8xl font-serif italic font-light tracking-tighter leading-none">
            {agenda.title}
          </h1>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="text-5xl md:text-6xl font-serif mb-1">
            {agenda.totalDuration}
            <span className="text-sm uppercase tracking-widest ml-2 italic">min</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">Total Allocated Time</span>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row min-h-[calc(100vh-180px)]">
        {/* Sidebar: Executive Summary & Holistic View */}
        <aside className="w-full lg:w-[380px] lg:border-r border-ink/20 flex flex-col p-8 md:p-12 bg-paper">
          <section className="mb-16">
            <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold mb-8 border-b border-ink/20 pb-3">
              Executive Summary
            </h2>
            <div className="prose prose-sm prose-neutral italic text-ink/80 leading-relaxed text-justify">
              <ReactMarkdown>{agenda.overallSummary}</ReactMarkdown>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold mb-8 border-b border-ink/20 pb-3">
              Key Stakeholders
            </h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(agenda.topics.flatMap(t => t.stakeholders))).map((person, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 border border-ink/10 rounded-full text-[10px] uppercase tracking-widest font-medium"
                >
                  {person}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-auto pt-12">
            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.3em] font-bold border border-ink py-4 px-6 hover:bg-ink hover:text-paper transition-all"
            >
              Export as PDF
              <Download className="w-4 h-4" />
            </button>
          </section>
        </aside>

        {/* Main Content: The Sequence */}
        <section className="flex-1 p-8 md:p-12 overflow-hidden bg-paper">
          <div className="flex justify-between items-baseline mb-12">
            <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold">Meeting Sequence</h2>
            <div className="h-[1px] flex-1 mx-8 bg-ink opacity-10"></div>
            <span className="text-[11px] opacity-40 font-mono">EST. 2024-08-14</span>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-12"
          >
            {agenda.topics.map((topic, index) => {
              const startAt = currentTime;
              currentTime += topic.durationMinutes;
              
              return (
                <motion.div
                  key={index}
                  variants={item}
                  className="grid grid-cols-[60px_1fr] md:grid-cols-[100px_1fr] gap-8 md:gap-12 group"
                >
                  <div className="flex flex-col items-end pt-1">
                    <span className="text-3xl font-serif italic text-ink leading-none">
                      {String(startAt).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono tracking-tighter opacity-40 mt-2 uppercase">
                      +{topic.durationMinutes}m
                    </span>
                  </div>
                  
                  <div className="border-b border-ink/10 pb-12 group-last:border-0">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight leading-tight">
                        {topic.title}
                      </h3>
                      <div className="flex gap-2 shrink-0">
                        {topic.stakeholders.slice(0, 2).map((s, i) => (
                          <span key={i} className="text-[9px] uppercase tracking-widest px-2 py-1 border border-ink/20 opacity-60">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="prose prose-sm prose-neutral text-ink/70 max-w-2xl mb-8 leading-relaxed">
                      <ReactMarkdown>{topic.summary}</ReactMarkdown>
                    </div>

                    {topic.actionItems.length > 0 && (
                      <div className="grid md:grid-cols-1 gap-4">
                        {topic.actionItems.map((action, i) => (
                          <div key={i} className="flex items-start gap-4 text-xs">
                            <div className="w-4 h-4 border border-ink/30 rounded-sm mt-0.5 shrink-0" />
                            <span className="text-ink/80">{action}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className="h-16 bg-ink text-paper flex items-center px-8 md:px-12 justify-between text-[10px] uppercase tracking-[0.4em] font-medium">
        <div className="flex items-center gap-4">
          <span>AgendaCraft Editorial</span>
          <span className="opacity-40 whitespace-nowrap hidden sm:inline">| System Time: 2026-05-10</span>
        </div>
        <div className="flex gap-8">
          <span className="cursor-pointer hover:opacity-60" onClick={() => window.print()}>Export PDF</span>
          <span className="cursor-pointer hover:opacity-60 hidden sm:inline">Calendar Sync</span>
          <span className="cursor-pointer hover:opacity-60" onClick={onReset}>Reset</span>
        </div>
      </footer>
    </div>
  );
};
