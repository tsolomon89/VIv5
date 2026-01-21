
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { PageRenderer } from './components/renderers/PageRenderer';
import { EditorOverlay } from './components/editor/EditorOverlay';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';

// Data & Hooks
import { useCheatCode } from './hooks/useCheatCode';
import { useSceneManager } from './hooks/useSceneManager';
import { useTemplateManager } from './hooks/useTemplateManager';
import { resolveSectionData } from './utils/resolution';

export default function App() {
  const { hasUnlockedDebug, isDebugMode, setIsDebugMode, flash, handleTouchStart, handleTouchEnd } = useCheatCode();
  
  // State Manager 1: Content (Legacy Data Map)
  const { 
      sections, singleConfig, updateSingleConfig, activeSectionId, setActiveSectionId, 
      addSceneObject, duplicateSceneObject, removeSceneObject, updateSceneObject, 
      updateSectionHeight, updateSectionPinHeight, toggleSceneObject, activeObjects 
  } = useSceneManager();

  // State Manager 2: Structure (New Template)
  const {
      template, 
      updateSectionBinding, 
      updateSectionPlacement,
      updateSectionPresentation,
      addSection,
      removeSection,
      importTemplate,
      loadTemplate
  } = useTemplateManager();
  
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('multi');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});

  // Sync active section ID if it gets deleted
  useEffect(() => {
      const exists = template.sections.some(s => s.id === activeSectionId);
      if (!exists && template.sections.length > 0) {
          setActiveSectionId(template.sections[0].id);
      }
  }, [template.sections, activeSectionId]);

  // --- Scroll Logic ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vH = window.innerHeight;
      const newProgress: Record<string, number> = {};

      // NOTE: We are iterating over the dynamic template sections now
      template.sections.forEach(section => {
          const key = section.id;
          
          // Resolve dimensions using the same logic as the renderer, passing the dynamic data map
          const { height, pinHeight } = resolveSectionData(key, section.binding, sections);

          if (key === 'hero-section') {
              // Standard Scroll for Hero
              newProgress[key] = Math.min(1, Math.max(0, scrollY / (height || 1)));
          } else {
              // Sticky Scroll for others
              const el = sectionRefs.current[key];
              if (el) {
                  const rect = el.getBoundingClientRect();
                  
                  // Calculate effective sticky travel distance
                  const trackHeight = height;
                  const effectivePinHeight = pinHeight || vH;
                  const scrollDistance = Math.max(1, trackHeight - effectivePinHeight);
                  
                  // rect.top logic
                  const scrolledPastStart = -rect.top;
                  const rawProgress = scrolledPastStart / scrollDistance;
                  
                  newProgress[key] = rawProgress;
              }
          }
      });
      setSectionProgress(newProgress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [template, sections]); // Dependency on dynamic template & sections

  const handleCopyConfig = async () => {
    try {
        // Export the Template Structure instead of raw sections
        await navigator.clipboard.writeText(JSON.stringify(template, null, 2));
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) { console.error(err); }
  };

  const handleImportConfig = () => {
      const input = prompt("Paste your PageTemplate JSON here:");
      if (input) {
          const result = importTemplate(input);
          if (!result.success) {
              alert(`Import failed: ${result.error}`);
          }
      }
  };

  const setSectionRef = (id: string, el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
  };

  return (
    <div className={`w-full min-h-screen relative font-sans text-white transition-colors duration-500 bg-[#1A1A1B]`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      
      <AnimatePresence>
          {flash && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-yellow-500/50 mix-blend-overlay pointer-events-none" />
          )}
      </AnimatePresence>

      <Header 
        isNavOpen={isNavOpen} 
        setIsNavOpen={setIsNavOpen} 
        hasUnlockedDebug={hasUnlockedDebug} 
        isDebugMode={isDebugMode} 
        setIsDebugMode={setIsDebugMode} 
        onCopyConfig={handleCopyConfig} 
        onImportConfig={handleImportConfig}
        onLoadTemplate={loadTemplate}
        copySuccess={copySuccess} 
      />
      
      <Navigation isOpen={isNavOpen} />
      
      {/* --- Main Content (Compiler Output) --- */}
      <main className="relative w-full">
         <div className="relative z-20 shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
            <PageRenderer 
                template={template} 
                sectionProgress={sectionProgress} 
                setSectionRef={setSectionRef}
                dataMap={sections}
            />
         </div>
      </main>

      {/* --- Editor --- */}
      <EditorOverlay
        isDebugMode={isDebugMode}
        // Active ID management
        activeSectionId={activeSectionId.includes('-section') ? activeSectionId : `${activeSectionId}-section`} // Normalize to full ID
        setActiveSectionId={(id) => setActiveSectionId(id)}
        
        // Data sources
        sections={sections} 
        template={template}
        
        // UI State
        sectionProgress={sectionProgress}
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        viewMode={viewMode}
        setViewMode={setViewMode}
        
        // Structure Actions
        updateSectionBinding={updateSectionBinding}
        updateSectionPlacement={updateSectionPlacement}
        updateSectionPresentation={updateSectionPresentation}
        addSection={addSection}
        removeSection={removeSection}
        
        // Content Actions (Legacy Bridge)
        updateSectionHeight={updateSectionHeight}
        updateSectionPinHeight={updateSectionPinHeight}
        singleConfig={singleConfig}
        updateSingleConfig={updateSingleConfig}
        addSceneObject={addSceneObject}
        activeObjects={activeObjects}
        toggleSceneObject={toggleSceneObject}
        duplicateSceneObject={duplicateSceneObject}
        removeSceneObject={removeSceneObject}
        updateSceneObject={updateSceneObject}
      />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
