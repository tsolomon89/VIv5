import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { SectionScene } from './components/scene/SectionScene';
import { SectionChapter } from './components/scene/SectionChapter';
import { Hero } from './components/sections/Hero';
import { EditorOverlay } from './components/editor/EditorOverlay';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { UseCases } from './components/sections/UseCases';
import { Products } from './components/sections/Products';
import { Features } from './components/sections/Features';
import { Solutions } from './components/sections/Solutions';
import { CTA } from './components/sections/CTA';

// Hooks
import { useCheatCode } from './hooks/useCheatCode';
import { useSceneManager } from './hooks/useSceneManager';

export default function App() {
  const { hasUnlockedDebug, isDebugMode, setIsDebugMode, flash, handleTouchStart, handleTouchEnd } = useCheatCode();
  const { 
      sections, singleConfig, updateSingleConfig, activeSectionId, setActiveSectionId, 
      addSceneObject, duplicateSceneObject, removeSceneObject, updateSceneObject, 
      updateSectionHeight, updateSectionPinHeight, toggleSceneObject, activeObjects 
  } = useSceneManager();
  
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('multi');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({ hero: 0 });

  // --- Scroll Logic ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vH = window.innerHeight;
      const newProgress: Record<string, number> = {};

      // Hero: 0 to 1 based on its height (Standard Scroll)
      newProgress['hero'] = Math.min(1, Math.max(0, scrollY / (sections['hero'].height || 1)));

      // Other Sections: Sticky Scroll Progress
      Object.keys(sections).forEach(key => {
          if (key === 'hero') return;
          const el = sectionRefs.current[key];
          if (el) {
              const rect = el.getBoundingClientRect();
              
              // Calculate effective sticky travel distance
              const trackHeight = sections[key].height;
              const pinHeight = sections[key].pinHeight || vH;
              const scrollDistance = Math.max(1, trackHeight - pinHeight);
              
              // Sticky Progress Math:
              // rect.top is the position of the element's top edge relative to viewport.
              // When rect.top is > 0, we haven't reached it (progress < 0)
              // When rect.top is 0, we are at start (progress 0)
              // When rect.top is negative, we are scrolling inside it.
              // When rect.top == -scrollDistance, we are at end (progress 1)
              const scrolledPastStart = -rect.top;
              const rawProgress = scrolledPastStart / scrollDistance;
              
              newProgress[key] = rawProgress;
          }
      });
      setSectionProgress(newProgress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleCopyConfig = async () => {
    try {
        await navigator.clipboard.writeText(JSON.stringify({ singleConfig, sections }, null, 2));
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) { console.error(err); }
  };

  return (
    <div className={`w-full min-h-screen relative font-sans text-white transition-colors duration-500 bg-[#1A1A1B]`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      
      <AnimatePresence>
          {flash && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-yellow-500/50 mix-blend-overlay pointer-events-none" />
          )}
      </AnimatePresence>

      <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} hasUnlockedDebug={hasUnlockedDebug} isDebugMode={isDebugMode} setIsDebugMode={setIsDebugMode} onCopyConfig={handleCopyConfig} copySuccess={copySuccess} />
      <Navigation isOpen={isNavOpen} />
      
      {/* --- Main Content --- */}
      <main className="relative w-full">
         <Hero 
            height={sections['hero'].height}
            objects={sections['hero'].objects}
            progress={sectionProgress['hero'] || 0}
         />
         
         {/* Main Content Container - NOTE: Removed overflow-hidden to allow sticky to work correctly */}
         <div className="relative z-20 shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
            
            <SectionChapter
                id="UseCases"
                height={sections['UseCases'].height}
                pinHeight={sections['UseCases'].pinHeight}
                objects={sections['UseCases'].objects}
                progress={sectionProgress['UseCases'] || 0}
                setRef={(el) => { sectionRefs.current['UseCases'] = el; }}
                className="bg-white rounded-t-3xl md:rounded-t-[4rem]" // Applied here for card effect
            >
                <UseCases />
            </SectionChapter>

            <SectionChapter
                id="Products"
                height={sections['Products'].height}
                pinHeight={sections['Products'].pinHeight}
                objects={sections['Products'].objects}
                progress={sectionProgress['Products'] || 0}
                setRef={(el) => { sectionRefs.current['Products'] = el; }}
                className="bg-white"
            >
                <Products />
            </SectionChapter>

            <SectionChapter
                id="Features"
                height={sections['Features'].height}
                pinHeight={sections['Features'].pinHeight}
                objects={sections['Features'].objects}
                progress={sectionProgress['Features'] || 0}
                setRef={(el) => { sectionRefs.current['Features'] = el; }}
                className="bg-white"
            >
                <Features />
            </SectionChapter>

            <SectionChapter
                id="Solutions"
                height={sections['Solutions'].height}
                pinHeight={sections['Solutions'].pinHeight}
                objects={sections['Solutions'].objects}
                progress={sectionProgress['Solutions'] || 0}
                setRef={(el) => { sectionRefs.current['Solutions'] = el; }}
                className="bg-neutral-50"
            >
                <Solutions />
            </SectionChapter>

            <SectionChapter
                id="CTA"
                height={sections['CTA'].height}
                pinHeight={sections['CTA'].pinHeight}
                objects={sections['CTA'].objects}
                progress={sectionProgress['CTA'] || 0}
                setRef={(el) => { sectionRefs.current['CTA'] = el; }}
                className="bg-black"
            >
                <CTA />
            </SectionChapter>

            <Footer />
         </div>
      </main>

      {/* --- Editor --- */}
      <EditorOverlay
        isDebugMode={isDebugMode}
        activeSectionId={activeSectionId}
        setActiveSectionId={setActiveSectionId}
        sectionProgress={sectionProgress}
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        sections={sections}
        viewMode={viewMode}
        setViewMode={setViewMode}
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