import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, ChevronDown, ChevronUp, Layers, MoveVertical, Box, Triangle, Circle, Square, Type, CloudLightning, Cloud, Trash2, Copy, PanelTop } from 'lucide-react';
import { FpsTracker } from '../FpsTracker';
import { ConfigControls, AddButton } from './ConfigControls';
import { ConfigState, SceneObject, ShapeType, SectionConfig } from '../../types';

interface EditorOverlayProps {
    isDebugMode: boolean;
    activeSectionId: string;
    setActiveSectionId: (id: string) => void;
    sectionProgress: Record<string, number>;
    isPanelOpen: boolean;
    setIsPanelOpen: (val: boolean) => void;
    sections: Record<string, SectionConfig>;
    viewMode: 'single' | 'multi';
    setViewMode: (mode: 'single' | 'multi') => void;
    updateSectionHeight: (h: number) => void;
    updateSectionPinHeight?: (h: number) => void;
    singleConfig: ConfigState;
    updateSingleConfig: (k: keyof ConfigState, v: any) => void;
    addSceneObject: (shape: ShapeType) => void;
    activeObjects: SceneObject[];
    toggleSceneObject: (id: string) => void;
    duplicateSceneObject: (id: string) => void;
    removeSceneObject: (id: string) => void;
    updateSceneObject: (id: string, k: keyof ConfigState, v: any) => void;
}

export const EditorOverlay: React.FC<EditorOverlayProps> = ({
    isDebugMode,
    activeSectionId,
    setActiveSectionId,
    sectionProgress,
    isPanelOpen,
    setIsPanelOpen,
    sections,
    viewMode,
    setViewMode,
    updateSectionHeight,
    updateSectionPinHeight,
    singleConfig,
    updateSingleConfig,
    addSceneObject,
    activeObjects,
    toggleSceneObject,
    duplicateSceneObject,
    removeSceneObject,
    updateSceneObject
}) => {
    return (
      <AnimatePresence>
        {isDebugMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="fixed inset-0 pointer-events-none z-50">
              {/* Progress Tracker (Left) */}
              <div className="fixed top-24 left-6 pointer-events-none mix-blend-difference hidden md:flex flex-col gap-6">
                 <div className="flex flex-col gap-1 opacity-50">
                    <span className="text-[10px] uppercase tracking-widest font-bold">{activeSectionId} Progress</span>
                    <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all duration-75" style={{ width: `${Math.max(0, Math.min(1, sectionProgress[activeSectionId] || 0)) * 100}%` }} />
                    </div>
                 </div>
                 <FpsTracker />
              </div>

              {/* Editor Panel (Right) */}
              <div className={`fixed bottom-6 right-6 pointer-events-auto transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isPanelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3.5rem)]'}`}>
                <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] w-80 md:w-96 flex flex-col max-h-[70vh] overflow-hidden ring-1 ring-white/5">
                    
                    {/* Header: Section Selector */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0 bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white/10 rounded-lg">
                              <Settings2 className="w-4 h-4 text-white" />
                            </div>
                            <select 
                                value={activeSectionId} 
                                onChange={(e) => setActiveSectionId(e.target.value)}
                                className="bg-transparent text-sm font-medium tracking-wide text-white/90 focus:outline-none cursor-pointer appearance-none uppercase"
                            >
                                {Object.keys(sections).map(k => <option key={k} value={k} className="text-black">{k}</option>)}
                            </select>
                            <ChevronDown className="w-3 h-3 text-white/50 -ml-1 pointer-events-none" />
                        </div>
                        <button onClick={() => setIsPanelOpen(!isPanelOpen)}>
                             {isPanelOpen ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronUp className="w-4 h-4 text-white/50" />}
                        </button>
                    </div>

                    {isPanelOpen && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                            {/* Mode Toggles (Hero Only) */}
                            {activeSectionId === 'hero' && (
                                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                                    <button 
                                        onClick={() => setViewMode('single')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${viewMode === 'single' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                                    >
                                        <Box className="w-3.5 h-3.5" />
                                        Single
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('multi')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${viewMode === 'multi' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                                    >
                                        <Layers className="w-3.5 h-3.5" />
                                        Multi
                                    </button>
                                </div>
                            )}

                            {/* Section Dimensions Control */}
                            <div className="bg-white/5 rounded-lg p-3 space-y-4">
                                {/* Total Height */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-white/60">
                                        <div className="flex items-center gap-2">
                                            <MoveVertical className="w-3 h-3" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">Scroll Height</span>
                                        </div>
                                        <span className="text-[10px]">{sections[activeSectionId].height}px</span>
                                    </div>
                                    <input 
                                        type="range" min="500" max={5000} step="50"
                                        value={sections[activeSectionId].height}
                                        onChange={(e) => updateSectionHeight(Number(e.target.value))}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                                    />
                                </div>

                                {/* Pin Height (Only if support func provided and not single mode hero) */}
                                {updateSectionPinHeight && (
                                    <div className="space-y-2 pt-2 border-t border-white/5">
                                        <div className="flex items-center justify-between text-white/60">
                                            <div className="flex items-center gap-2">
                                                <PanelTop className="w-3 h-3" />
                                                <span className="text-[10px] uppercase font-bold tracking-wider">Pin Height</span>
                                            </div>
                                            <span className="text-[10px]">{sections[activeSectionId].pinHeight}px</span>
                                        </div>
                                        <input 
                                            type="range" min="300" max={1500} step="50"
                                            value={sections[activeSectionId].pinHeight}
                                            onChange={(e) => updateSectionPinHeight(Number(e.target.value))}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:rounded-full"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Single Mode Config (Hero Only) */}
                            {viewMode === 'single' && activeSectionId === 'hero' ? (
                                <ConfigControls config={singleConfig} onChange={updateSingleConfig} headerOffset={0} sectionHeaderClass="-mx-6 px-6" />
                            ) : (
                                <>
                                    {/* Add Buttons */}
                                    <div className="space-y-3 p-2">
                                         <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Add to {activeSectionId}</label>
                                         <div className="grid grid-cols-4 gap-2">
                                            {activeSectionId === 'UseCases' ? (
                                                 <AddButton icon={<Type className="w-4 h-4" />} label="Text" onClick={() => addSceneObject('text')} />
                                            ) : activeSectionId === 'Products' ? (
                                                 <AddButton icon={<Square className="w-4 h-4" />} label="Plane" onClick={() => addSceneObject('plane')} />
                                            ) : (
                                                <>
                                                    <AddButton icon={<Triangle className="w-4 h-4" />} label="Pyramid" onClick={() => addSceneObject('tetrahedron')} />
                                                    <AddButton icon={<Box className="w-4 h-4" />} label="Cube" onClick={() => addSceneObject('cube')} />
                                                    <AddButton icon={<Circle className="w-4 h-4" />} label="Sphere" onClick={() => addSceneObject('sphere')} />
                                                    <AddButton icon={<Square className="w-4 h-4" />} label="Plane" onClick={() => addSceneObject('plane')} />
                                                    <AddButton icon={<Type className="w-4 h-4" />} label="Text" onClick={() => addSceneObject('text')} />
                                                    <AddButton icon={<CloudLightning className="w-4 h-4" />} label="Lightning" onClick={() => addSceneObject('lightning')} />
                                                    <AddButton icon={<Cloud className="w-4 h-4" />} label="Atmos" onClick={() => addSceneObject('atmosphere')} />
                                                </>
                                            )}
                                         </div>
                                    </div>

                                    <div className="h-px bg-white/5 mx-2" />

                                    {/* Object List */}
                                    <div className="space-y-3">
                                         {activeObjects.map((obj, idx) => (
                                             <div key={obj.id} className="bg-white/5 border border-white/10 rounded-xl relative group">
                                                 <div 
                                                    className="sticky top-0 z-30 flex items-center justify-between px-4 h-[45px] bg-[#121212]/90 backdrop-blur-xl border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors rounded-t-xl shadow-lg"
                                                    onClick={() => toggleSceneObject(obj.id)}
                                                 >
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded text-[10px] font-mono text-white/50">{idx + 1}</span>
                                                        <span className="text-xs font-medium text-white/80 capitalize">{obj.shape}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={(e) => { e.stopPropagation(); duplicateSceneObject(obj.id); }} className="p-1.5 hover:bg-white/10 text-white/30 hover:text-white rounded transition-colors" title="Duplicate Layer"><Copy className="w-3.5 h-3.5" /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); removeSceneObject(obj.id); }} className="p-1.5 hover:bg-red-500/20 text-white/30 hover:text-red-400 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                                        {obj.isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-white/40" /> : <ChevronDown className="w-3.5 h-3.5 text-white/40" />}
                                                    </div>
                                                 </div>
                                                 {obj.isExpanded && (
                                                     <div className="p-4 border-t border-white/5 bg-black/20 rounded-b-xl">
                                                         <ConfigControls config={obj} onChange={(k, v) => updateSceneObject(obj.id, k, v)} headerOffset={45} sectionHeaderClass="-mx-4 px-4" />
                                                     </div>
                                                 )}
                                             </div>
                                         ))}
                                         {activeObjects.length === 0 && (
                                            <div className="text-center text-white/20 text-xs py-8 italic">No objects in {activeSectionId} scene</div>
                                         )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
};