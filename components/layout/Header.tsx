
import React, { useState } from 'react';
import { Menu, X, Power, Check, Copy, Download, LayoutTemplate, ChevronDown, PlusCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { TEMPLATES } from '../../data';
import { checkCoverage, getMissingSignaturesLabel } from '../../utils/coverage';

interface HeaderProps {
    isNavOpen: boolean;
    setIsNavOpen: (val: boolean) => void;
    hasUnlockedDebug: boolean;
    isDebugMode: boolean;
    setIsDebugMode: (val: boolean) => void;
    onCopyConfig: () => void;
    onImportConfig?: () => void; 
    onLoadTemplate?: (id: string) => void;
    onCreatePage?: () => void; // New Prop
    copySuccess: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
    isNavOpen, setIsNavOpen, hasUnlockedDebug, isDebugMode, setIsDebugMode, 
    onCopyConfig, onImportConfig, onLoadTemplate, onCreatePage, copySuccess 
}) => {
    const [showTemplates, setShowTemplates] = useState(false);
    const coverage = checkCoverage();

    return (
      <header className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between px-6 py-6 mix-blend-difference text-white pointer-events-none">
        <div className="text-2xl font-bold tracking-tighter pointer-events-auto cursor-pointer z-50 relative py-2">vi</div>
        <div className="flex flex-col items-end gap-4 pointer-events-auto relative z-50">
            <button onClick={() => setIsNavOpen(!isNavOpen)} className="p-2 -mr-2 hover:opacity-70 transition-opacity cursor-pointer">
              {isNavOpen ? <X size={32} strokeWidth={1.5} /> : <Menu size={32} strokeWidth={1.5} />}
            </button>
            <AnimatePresence>
              {hasUnlockedDebug && (
                <div className="flex flex-col gap-4 items-end">
                    {/* Coverage Alert */}
                    {coverage.missing.length > 0 && isDebugMode && (
                        <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-lg px-3 py-1.5 text-[10px] font-mono text-red-200 max-w-[200px] text-right">
                            Missing Presets: {getMissingSignaturesLabel(coverage.missing)}
                        </div>
                    )}

                    {isDebugMode && (
                      <div className="flex items-center gap-3">
                          {/* Template Switcher */}
                          <div className="relative">
                              <button 
                                onClick={() => setShowTemplates(!showTemplates)}
                                className="flex items-center gap-2 h-12 px-4 rounded-full bg-white/10 text-white/50 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                              >
                                  <LayoutTemplate size={18} />
                                  <span className="text-xs font-medium hidden md:block">Template</span>
                                  <ChevronDown size={14} />
                              </button>
                              
                              <AnimatePresence>
                                  {showTemplates && (
                                      <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1b] border border-white/10 rounded-xl overflow-hidden shadow-2xl py-1"
                                      >
                                          <div className="px-4 py-2 border-b border-white/5">
                                              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Presets</span>
                                          </div>
                                          {Object.values(TEMPLATES).map(t => (
                                              <button
                                                key={t.id}
                                                onClick={() => { onLoadTemplate?.(t.id); setShowTemplates(false); }}
                                                className="w-full text-left px-4 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                              >
                                                  {t.name}
                                              </button>
                                          ))}
                                          
                                          {onCreatePage && (
                                              <div className="border-t border-white/5 pt-1 mt-1">
                                                  <button
                                                    onClick={() => { onCreatePage(); setShowTemplates(false); }}
                                                    className="w-full text-left px-4 py-2.5 text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-500/10 transition-colors flex items-center gap-2"
                                                  >
                                                      <PlusCircle size={12} />
                                                      Create New Page
                                                  </button>
                                              </div>
                                          )}
                                      </motion.div>
                                  )}
                              </AnimatePresence>
                          </div>

                          {onImportConfig && (
                              <motion.button 
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2, delay: 0.05 }} 
                                onClick={onImportConfig} 
                                className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer bg-white/10 text-white/50 hover:bg-white/20 hover:text-white" 
                                title="Import Configuration"
                              >
                                  <Download size={20} strokeWidth={2} />
                              </motion.button>
                          )}
                          <motion.button 
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} 
                            onClick={onCopyConfig} 
                            className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer bg-white/10 text-white/50 hover:bg-white/20 hover:text-white" 
                            title="Copy Configuration"
                          >
                              {copySuccess ? <Check size={20} className="text-green-400" /> : <Copy size={20} strokeWidth={2} />}
                          </motion.button>
                      </div>
                    )}
                    <motion.button initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} onClick={() => setIsDebugMode(!isDebugMode)} className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer ${isDebugMode ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'}`} title={`Developer Mode ${isDebugMode ? 'ON' : 'OFF'}`}>
                        <Power size={20} strokeWidth={2} />
                    </motion.button>
                </div>
              )}
            </AnimatePresence>
        </div>
      </header>
    );
};
