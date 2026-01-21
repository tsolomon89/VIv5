import React, { useState, useEffect, useRef } from 'react';
import { PrismBackground } from './components/PrismBackground';
import { StormBackground } from './components/StormBackground';
import { FpsTracker } from './components/FpsTracker';
import { Settings2, ChevronDown, ChevronUp, Layers, Monitor, Trash2, Box, Circle, Triangle, Link2, Unlink, X, MoveVertical, ArrowRight, ArrowLeft, Zap, Plus, ArrowUpRight, Hexagon, Square, Menu, Power, Copy, Check, CheckCircle, Sparkles, Cloud, CloudLightning, Type, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

type ShapeType = 'tetrahedron' | 'cube' | 'sphere' | 'cylinder' | 'torus' | 'column' | 'lightning' | 'atmosphere' | 'text' | 'plane';
type AnimType = 'rotate' | 'hover' | '3drotate' | 'static';

// New Type for Animated Parameters
interface NumberParam {
  value: number;        // Start Value
  endValue: number | null; // End Value (null if single point)
  isLinked: boolean;    // Is linked to scroll?
}

// Unified Config State
interface ConfigState {
  // Common
  offsetZ: NumberParam;

  // Prism Props
  height: NumberParam;
  baseWidth: NumberParam;
  scale: NumberParam;
  glow: NumberParam;
  noise: NumberParam;
  bloom: NumberParam;
  hueShift: NumberParam;
  colorFrequency: NumberParam;
  timeScale: NumberParam;
  animationType: AnimType; 
  shape: ShapeType;        
  hoverStrength: NumberParam;
  inertia: NumberParam;
  offsetX: NumberParam;
  offsetY: NumberParam;
  saturation: NumberParam;
  rainbow: NumberParam;
  density: NumberParam;
  opacity: NumberParam;
  rotateX: NumberParam;
  rotateY: NumberParam;
  rotateZ: NumberParam;

  // Storm Props (Merged)
  hue: NumberParam;
  intensity: NumberParam;
  strikeIntensity: NumberParam;
  frequency: NumberParam;
  speed: NumberParam;
  cloudiness: NumberParam;
  boltWidth: NumberParam;
  zigzag: NumberParam;
  diagonal: NumberParam;
  depth: NumberParam;
  cloudScale: NumberParam;
  flashDuration: NumberParam;
  boltDuration: NumberParam;
  boltGlow: NumberParam;
  
  // Text Props
  textHeading: string;
  textLabel: string;
  textSubtitle: string;
  textAlign: 'left' | 'center' | 'right';
  textTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
  
  // Advanced Text Styles
  headingSize: NumberParam;
  headingSpacing: NumberParam;
  headingHeight: NumberParam;
  headingColor: string;
  
  labelSize: NumberParam;
  labelSpacing: NumberParam;
  labelColor: string;
  
  subSize: NumberParam;
  subColor: string;
  
  // Plane Props
  textureUrl: string;
  sizingMode: 'cover' | 'contain' | 'native';
}

interface SceneObject extends ConfigState {
  id: string;
  isExpanded: boolean;
}

// --- Content Data ---

const projects = [
  { 
    title: "Neo Tokyo Art Fair", 
    category: "Branding", 
    year: "2024",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2670&auto=format&fit=crop"
  },
  { 
    title: "Cyber Zen Garden", 
    category: "Web Design", 
    year: "2023",
    image: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=2576&auto=format&fit=crop"
  },
  { 
    title: "Type Foundry X", 
    category: "Typography", 
    year: "2023",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop"
  },
  { 
    title: "Mono Coffee", 
    category: "Packaging", 
    year: "2023",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2670&auto=format&fit=crop"
  }
];

const sliderImages = [
  "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=2500&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2500&auto=format&fit=crop", 
];

const clients = [
  { name: 'Blob', icon: Circle },
  { name: 'Yallo!', icon: Hexagon },
  { name: 'Bliss+', icon: Square },
  { name: 'Flea', icon: Triangle },
];


// --- Helper Functions ---

const mkParam = (val: number): NumberParam => ({ value: val, endValue: null, isLinked: false });

const DEFAULT_CONFIG: ConfigState = {
  // Prism Defaults
  height: mkParam(1),
  baseWidth: mkParam(1),
  scale: mkParam(100),
  glow: mkParam(1),
  noise: mkParam(0.5),
  bloom: mkParam(1),
  hueShift: mkParam(0),
  colorFrequency: mkParam(1),
  timeScale: mkParam(0.5),
  animationType: 'static',
  shape: 'tetrahedron',
  hoverStrength: mkParam(2),
  inertia: mkParam(0.05),
  offsetX: mkParam(0),
  offsetY: mkParam(0),
  offsetZ: mkParam(0),
  saturation: mkParam(1.1),
  rainbow: mkParam(1.0),
  density: mkParam(0.2),
  opacity: mkParam(1.0),
  rotateX: mkParam(0),
  rotateY: mkParam(0),
  rotateZ: mkParam(0),

  // Storm Defaults (Placeholders)
  hue: mkParam(220),
  intensity: mkParam(1.5),
  strikeIntensity: mkParam(1.0),
  frequency: mkParam(1.0),
  speed: mkParam(1.0),
  cloudiness: mkParam(0.5),
  boltWidth: mkParam(1.0),
  zigzag: mkParam(1.0),
  diagonal: mkParam(0.0),
  depth: mkParam(0.0),
  cloudScale: mkParam(1.0),
  flashDuration: mkParam(1.0),
  boltDuration: mkParam(0.5),
  boltGlow: mkParam(1.0),
  
  // Text Defaults
  textHeading: 'Heading',
  textLabel: 'Label',
  textSubtitle: 'Subtitle',
  textAlign: 'center',
  textTag: 'h1',
  headingSize: mkParam(120),
  headingSpacing: mkParam(-0.05),
  headingHeight: mkParam(0.9),
  headingColor: '#ffffff',
  labelSize: mkParam(12),
  labelSpacing: mkParam(0.2),
  labelColor: 'rgba(255,255,255,0.6)',
  subSize: mkParam(18),
  subColor: 'rgba(255,255,255,0.6)',
  
  // Plane Defaults
  textureUrl: '',
  sizingMode: 'cover'
};

// Flattened config for the actual component prop structure
type RenderProps = any; 

// --- Content Sections ---
// (Sections UseCases, Products, Features, Solutions, CTA omitted for brevity as they are unchanged)
// ... Keep existing section components ...
const UseCases = () => (
  <section className="py-24 px-6 md:px-12 bg-white text-black">
    <div className="max-w-5xl mx-auto text-center mb-24">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight"
      >
        We're Superdesign® — a creative studio cultivating bold brands, beautiful websites, and ideas that refuse to be ordinary.
      </motion.h2>
    </div>
    <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
      {clients.map((client, i) => (
        <div key={i} className="flex items-center gap-2 text-xl font-medium text-neutral-500">
          <client.icon className="w-6 h-6" />
          <span>{client.name}</span>
        </div>
      ))}
    </div>
  </section>
);
const Products = () => {
  return (
    <section className="py-24 bg-white overflow-hidden cursor-move select-none border-t border-black/5">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="group w-full overflow-hidden">
        <div className="flex gap-4 md:gap-8 animate-marquee w-max pl-4">
          {[...sliderImages, ...sliderImages, ...sliderImages, ...sliderImages].map((src, i) => (
            <div 
              key={i} 
              className={`
                relative flex-shrink-0 w-[280px] h-[400px] md:w-[400px] md:h-[560px] overflow-hidden transition-all duration-500 hover:opacity-90
                ${i % 3 === 0 ? 'rounded-tl-[100px]' : ''}
                ${i % 3 === 1 ? 'rounded-tr-[100px] rounded-bl-[40px]' : ''}
                ${i % 3 === 2 ? 'rounded-[40px]' : ''}
              `}
            >
              <img 
                src={src} 
                alt={`Project ${i}`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
const Features = () => (
  <section className="py-24 px-6 md:px-12 bg-white text-black border-t border-black/5">
    <div className="flex items-end justify-between mb-16 border-b border-black/10 pb-8">
      <h2 className="text-5xl md:text-7xl font-medium tracking-tighter">Latest <br/> Projects.</h2>
      <span className="hidden md:block font-mono text-sm">( _04 )</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
      {projects.map((project, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: i * 0.1 }}
          className="group cursor-pointer"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 rounded-sm mb-6">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 bg-white rounded-full p-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div className="flex justify-between items-start border-t border-black/10 pt-4">
            <div>
              <h3 className="text-2xl font-medium tracking-tight mb-1">{project.title}</h3>
              <p className="text-neutral-500">{project.category}</p>
            </div>
            <span className="font-mono text-sm text-neutral-400">{project.year}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);
const Solutions = () => (
    <section className="py-24 px-6 md:px-12 bg-neutral-50 text-black border-t border-black/5">
        <div className="max-w-7xl mx-auto">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-sm font-mono text-neutral-400 block mb-4">/ SERVICES</span>
                    <h2 className="text-4xl md:text-6xl font-medium tracking-tighter">Our Expertise.</h2>
                </div>
                <p className="max-w-md text-neutral-500">
                    We combine strategic thinking with design excellence to create brands that stand out in a crowded digital landscape.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: 'Brand Identity', desc: 'Crafting distinct visual languages that resonate with your audience and stand the test of time.', icon: Hexagon },
                    { title: 'Digital Products', desc: 'Building robust, scalable web applications with cutting-edge technologies and seamless UX.', icon: Square },
                    { title: 'Motion Design', desc: 'Bringing static interfaces to life with fluid animations and interactive 3D experiences.', icon: Triangle }
                ].map((s, i) => (
                    <div key={i} className="group p-8 bg-white border border-black/5 rounded-2xl hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500">
                             <s.icon size={100} />
                        </div>
                        <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                            <CheckCircle size={20} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 relative z-10">{s.title}</h3>
                        <p className="text-neutral-500 leading-relaxed relative z-10">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
const CTA = () => (
   <section className="py-32 px-6 md:px-12 bg-black text-white relative overflow-hidden">
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
       <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
       <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm mb-8">
                    <Sparkles size={14} className="text-yellow-200" />
                    <span className="text-white/80">Open for new collaborations</span>
               </div>
               <h2 className="text-5xl md:text-8xl font-medium tracking-tighter mb-8">Ready to start?</h2>
               <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto">
                   Let's build something extraordinary together. Reach out to discuss your next project.
               </p>
               <button className="px-10 py-5 bg-white text-black rounded-full text-lg font-bold hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 group">
                   Get in touch <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </button>
           </motion.div>
       </div>
   </section>
);

// --- Layout Components ---
const Header = ({ isNavOpen, setIsNavOpen, hasUnlockedDebug, isDebugMode, setIsDebugMode, onCopyConfig, copySuccess }: any) => (
  <header className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between px-6 py-6 mix-blend-difference text-white pointer-events-none">
    <div className="text-2xl font-bold tracking-tighter pointer-events-auto cursor-pointer z-50 relative py-2">vi</div>
    <div className="flex flex-col items-end gap-4 pointer-events-auto relative z-50">
        <button onClick={() => setIsNavOpen(!isNavOpen)} className="p-2 -mr-2 hover:opacity-70 transition-opacity cursor-pointer">
          {isNavOpen ? <X size={32} strokeWidth={1.5} /> : <Menu size={32} strokeWidth={1.5} />}
        </button>
        <AnimatePresence>
          {hasUnlockedDebug && (
            <div className="flex flex-col gap-4 items-center">
                {isDebugMode && (
                  <motion.button initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} onClick={onCopyConfig} className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer bg-white/10 text-white/50 hover:bg-white/20 hover:text-white" title="Copy Current Configuration">
                      {copySuccess ? <Check size={20} className="text-green-400" /> : <Copy size={20} strokeWidth={2} />}
                  </motion.button>
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
const Navigation = ({ isOpen }: { isOpen: boolean }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-40 bg-neutral-950 flex flex-col items-center justify-center">
        <nav className="flex flex-col gap-8 text-center">
          {['Work', 'Studio', 'Contact'].map((item, i) => (
            <motion.a href="#" key={item} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }} className="text-4xl md:text-6xl font-medium tracking-tighter hover:text-white/60 transition-colors">{item}</motion.a>
          ))}
        </nav>
      </motion.div>
    )}
  </AnimatePresence>
);
const Footer = () => (
  <footer className="py-12 px-6 md:px-12 bg-neutral-950 text-white">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
      <div className="col-span-1 md:col-span-2">
        <h2 className="text-4xl font-bold tracking-tighter mb-8">Superdesign®</h2>
        <p className="max-w-md text-neutral-400">A digital design studio crafting experiences for the modern web. Based in Tokyo, working globally.</p>
      </div>
    </div>
    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-neutral-600">
      <p>© 2024 Superdesign Studio. All rights reserved.</p>
    </div>
  </footer>
);


// --- Text Rendering Component ---
const SceneTextRenderer = ({ objects, scrollProgress }: { objects: SceneObject[], scrollProgress: number }) => {
    // Helper to interpolate
    const getVal = (param: NumberParam) => {
        if (param.isLinked && param.endValue !== null) {
            return param.value + (param.endValue - param.value) * scrollProgress;
        }
        return param.value;
    };

    return (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" style={{ perspective: '1000px' }}>
            {objects.filter(o => o.shape === 'text').map(obj => {
                const x = getVal(obj.offsetX);
                const y = getVal(obj.offsetY);
                const z = getVal(obj.offsetZ);
                const scale = getVal(obj.scale) / 100; // Scale 100 = 1.0
                const opacity = getVal(obj.opacity);
                const blur = (1 - opacity) * 20;
                
                // Dynamic Heading Tag
                const Tag = (obj.textTag || 'h2') as any;

                return (
                    <div 
                        key={obj.id}
                        className="absolute top-1/2 left-1/2 w-[600px] -ml-[300px] -mt-[100px] flex flex-col justify-center"
                        style={{
                            transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`,
                            textAlign: obj.textAlign,
                            opacity: opacity,
                            filter: `blur(${blur}px)`
                        }}
                    >
                        {obj.textLabel && (
                            <div style={{
                                fontSize: `${getVal(obj.labelSize)}px`,
                                letterSpacing: `${getVal(obj.labelSpacing)}em`,
                                color: obj.labelColor
                            }} className="font-bold uppercase mb-4 font-mono transition-colors duration-200">
                                {obj.textLabel}
                            </div>
                        )}
                        {obj.textHeading && (
                            <Tag style={{
                                fontSize: `${getVal(obj.headingSize)}px`,
                                letterSpacing: `${getVal(obj.headingSpacing)}em`,
                                lineHeight: getVal(obj.headingHeight),
                                color: obj.headingColor
                            }} className="font-medium mb-6 transition-colors duration-200">
                                {obj.textHeading}
                            </Tag>
                        )}
                        {obj.textSubtitle && (
                            <p style={{
                                fontSize: `${getVal(obj.subSize)}px`,
                                color: obj.subColor
                            }} className="font-light max-w-md mx-auto transition-colors duration-200">
                                {obj.textSubtitle}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// --- Main App Component ---

export default function App() {
  const [hasUnlockedDebug, setHasUnlockedDebug] = useState(() => {
     return localStorage.getItem('debug_unlocked') === 'true';
  });

  const [isDebugMode, setIsDebugModeState] = useState(() => {
    const saved = localStorage.getItem('debug_mode');
    return localStorage.getItem('debug_unlocked') === 'true' && saved === 'true';
  });
  
  const [flash, setFlash] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('multi');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  // Scroll Interaction State
  const [scrollPixels, setScrollPixels] = useState(1500);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Single Object Mode State
  const [singleConfig, setSingleConfig] = useState<ConfigState>(JSON.parse(JSON.stringify(DEFAULT_CONFIG)));

  const setIsDebugMode = (val: boolean) => {
      setIsDebugModeState(val);
      localStorage.setItem('debug_mode', String(val));
  };

  // --- CHEAT CODE LOGIC ---
  const inputBuffer = useRef<string[]>([]);
  const touchStart = useRef<{x:number, y:number} | null>(null);

  const SEQUENCE = [
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 
    'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'
  ];

  const checkSequence = (key: string) => {
    const buffer = inputBuffer.current;
    buffer.push(key);
    if (buffer.length > SEQUENCE.length) {
        buffer.shift();
    }
    if (JSON.stringify(buffer) === JSON.stringify(SEQUENCE)) {
        if (!hasUnlockedDebug) {
            setHasUnlockedDebug(true);
            localStorage.setItem('debug_unlocked', 'true');
        }
        setIsDebugMode(true);
        setFlash(true);
        setTimeout(() => setFlash(false), 1000);
        inputBuffer.current = [];
    }
  };

  const handleCopyConfig = async () => {
    const configExport = {
        singleConfig,
        sceneObjects,
        settings: {
            scrollPixels,
            viewMode
        },
        timestamp: new Date().toISOString()
    };
    try {
        await navigator.clipboard.writeText(JSON.stringify(configExport, null, 2));
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
        console.error("Failed to copy configuration:", err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => checkSequence(e.key);
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnlockedDebug]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
        if (Math.abs(dx) > Math.abs(dy)) {
            checkSequence(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
        } else {
            checkSequence(dy > 0 ? 'ArrowDown' : 'ArrowUp');
        }
    }
    touchStart.current = null;
  };


  // Helper to generate default scene objects
  const getInitialSceneObjects = (): SceneObject[] => {
    const createObj = (overrides: Partial<ConfigState>): SceneObject => {
        const base = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        return {
            ...base,
            ...overrides,
            id: Math.random().toString(36).substr(2, 9),
            isExpanded: false
        };
    };

    return [
        createObj({
            shape: 'tetrahedron',
            animationType: 'static',
            rotateX: mkParam(0),
            rotateY: mkParam(0),
            rotateZ: mkParam(0),
            scale: mkParam(100),
            height: mkParam(2),
            baseWidth: mkParam(2),
            glow: mkParam(1),
            bloom: mkParam(1),
            noise: mkParam(0.02),
            hueShift: mkParam(1.90),
            colorFrequency: mkParam(1),
            saturation: mkParam(1.1),
            rainbow: mkParam(1),
            density: mkParam(0.2),
            opacity: mkParam(1),
            timeScale: mkParam(0.5),
            offsetX: mkParam(0),
            offsetY: mkParam(-346.04),
        }),
        createObj({
            shape: 'tetrahedron',
            animationType: 'static',
            rotateX: mkParam(0),
            rotateY: mkParam(0),
            rotateZ: mkParam(3.14),
            scale: mkParam(100),
            height: mkParam(6.94),
            baseWidth: mkParam(2.49),
            glow: mkParam(0.72),
            bloom: mkParam(1.5),
            noise: mkParam(0.02),
            hueShift: mkParam(6.07),
            colorFrequency: mkParam(0.59),
            saturation: mkParam(2.14),
            rainbow: mkParam(4.64),
            density: mkParam(0.14),
            opacity: mkParam(1),
            timeScale: mkParam(0.5),
            offsetX: mkParam(0),
            offsetY: mkParam(171.83),
        }),
        createObj({
            shape: 'sphere',
            animationType: 'static',
            rotateX: mkParam(0),
            rotateY: mkParam(0),
            rotateZ: mkParam(0),
            scale: mkParam(200),
            height: mkParam(1),
            baseWidth: mkParam(2),
            glow: mkParam(1),
            bloom: mkParam(1),
            noise: mkParam(0.03),
            hueShift: mkParam(4.40),
            colorFrequency: mkParam(1),
            saturation: mkParam(1.1),
            rainbow: mkParam(1),
            density: mkParam(0.2),
            opacity: mkParam(1),
            timeScale: mkParam(0.5),
            offsetX: mkParam(-100),
            offsetY: mkParam(0),
        }),
        createObj({
            shape: 'sphere',
            animationType: 'static',
            rotateX: mkParam(0),
            rotateY: mkParam(0),
            rotateZ: mkParam(0),
            scale: mkParam(200),
            height: mkParam(1),
            baseWidth: mkParam(2),
            glow: mkParam(1),
            bloom: mkParam(1),
            noise: mkParam(0.03),
            hueShift: mkParam(4.40),
            colorFrequency: mkParam(1),
            saturation: mkParam(1.1),
            rainbow: mkParam(1),
            density: mkParam(0.2),
            opacity: mkParam(1),
            timeScale: mkParam(0.5),
            offsetX: mkParam(100),
            offsetY: mkParam(0),
        })
    ];
  };

  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>(getInitialSceneObjects());

  // --- Scroll Logic ---
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const progress = Math.min(1, Math.max(0, y / (scrollPixels || 1)));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollPixels]);

  // --- Interpolation Helper ---
  const getRenderValue = (param: NumberParam, progress: number): number => {
    if (param.isLinked && param.endValue !== null) {
      return param.value + (param.endValue - param.value) * progress;
    }
    return param.value;
  };

  // Convert ConfigState to props
  const getRenderConfig = (config: ConfigState, progress: number): RenderProps => {
    const props: any = {};
    Object.keys(config).forEach(key => {
      const k = key as keyof ConfigState;
      // Pass through all non-numeric parameters explicitly
      if (
          k === 'shape' || k === 'animationType' || 
          k === 'textHeading' || k === 'textLabel' || k === 'textSubtitle' || k === 'textAlign' || k === 'textTag' ||
          k === 'headingColor' || k === 'labelColor' || k === 'subColor' ||
          k === 'textureUrl' || k === 'sizingMode'
      ) {
        props[k] = config[k];
      } else {
        props[k] = getRenderValue(config[k] as NumberParam, progress);
      }
    });
    return {
      ...props,
      offset: { x: props.offsetX, y: props.offsetY, z: props.offsetZ },
      rotation: { x: props.rotateX, y: props.rotateY, z: props.rotateZ }
    };
  };

  // --- Handlers ---

  const updateSingleConfig = (key: keyof ConfigState, value: any) => {
    setSingleConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const addSceneObject = (shape: ShapeType) => {
    const cleanConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    const newObj: SceneObject = {
      ...cleanConfig,
      id: Math.random().toString(36).substr(2, 9),
      shape,
      isExpanded: true,
      hueShift: mkParam(Math.random() * 6.28),
    };
    setSceneObjects(prev => [newObj, ...prev]);
  };
  
  const duplicateSceneObject = (id: string) => {
    setSceneObjects(prev => {
        const index = prev.findIndex(o => o.id === id);
        if (index === -1) return prev;
        
        const original = prev[index];
        const copy: SceneObject = {
            ...JSON.parse(JSON.stringify(original)), // Deep copy to detach references
            id: Math.random().toString(36).substr(2, 9),
            isExpanded: true 
        };
        
        // Insert after original
        const newList = [...prev];
        newList.splice(index + 1, 0, copy);
        return newList;
    });
  };

  const removeSceneObject = (id: string) => {
    setSceneObjects(prev => prev.filter(o => o.id !== id));
  };

  const updateSceneObject = (id: string, key: keyof ConfigState, value: any) => {
    setSceneObjects(prev => prev.map(o => o.id === id ? { ...o, [key]: value } : o));
  };

  const toggleSceneObject = (id: string) => {
    setSceneObjects(prev => prev.map(o => o.id === id ? { ...o, isExpanded: !o.isExpanded } : o));
  };

  const SECTIONS_CONFIG = [
      { id: 'UseCases', Component: UseCases, order: 1 },
      { id: 'Products', Component: Products, order: 2 },
      { id: 'Features', Component: Features, order: 3 },
      { id: 'Solutions', Component: Solutions, order: 4 },
      { id: 'CTA', Component: CTA, order: undefined }
  ];

  const sortedSections = React.useMemo(() => {
      const ordered = SECTIONS_CONFIG.filter(s => s.order !== undefined).sort((a,b) => a.order! - b.order!);
      const unordered = SECTIONS_CONFIG.filter(s => s.order === undefined);
      const unorderedCTA = unordered.filter(s => s.id === 'CTA');
      const unorderedOthers = unordered.filter(s => s.id !== 'CTA');
      return [...ordered, ...unorderedOthers, ...unorderedCTA];
  }, []);

  return (
    <div 
        className={`w-full min-h-screen relative font-sans text-white transition-colors duration-500`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
    >
      
      <AnimatePresence>
          {flash && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="fixed inset-0 z-[100] bg-yellow-500/50 mix-blend-overlay pointer-events-none"
            />
          )}
      </AnimatePresence>

      <Header 
        isNavOpen={isNavOpen} 
        setIsNavOpen={setIsNavOpen} 
        hasUnlockedDebug={hasUnlockedDebug}
        isDebugMode={isDebugMode}
        setIsDebugMode={setIsDebugMode}
        onCopyConfig={handleCopyConfig}
        copySuccess={copySuccess}
      />
      
      <Navigation isOpen={isNavOpen} />
      
      {/* --- Unified Render Layer --- */}
      <div className="fixed inset-0 z-0 bg-[#1A1A1B]">
          <div className="absolute inset-0 z-0 overflow-hidden">
             
             {/* Text Layer (HTML) */}
             <SceneTextRenderer objects={sceneObjects} scrollProgress={scrollProgress} />

            {viewMode === 'single' ? (
              <PrismBackground
                {...getRenderConfig(singleConfig, scrollProgress)}
                transparent={true}
                suspendWhenOffscreen={false}
              />
            ) : (
              <>
                 {sceneObjects.map(obj => {
                    if (obj.shape === 'text') return null; // Rendered by SceneTextRenderer
                    
                    const config = getRenderConfig(obj, scrollProgress);
                    
                    if (obj.shape === 'lightning' || obj.shape === 'atmosphere') {
                        return (
                            <div key={obj.id} className="absolute inset-0 pointer-events-none">
                                <StormBackground
                                    variant={obj.shape === 'lightning' ? 'lightning' : 'atmosphere'}
                                    hue={config.hue}
                                    intensity={config.intensity}
                                    strikeIntensity={config.strikeIntensity}
                                    frequency={config.frequency}
                                    speed={config.speed}
                                    cloudiness={config.cloudiness}
                                    boltWidth={config.boltWidth}
                                    zigzag={config.zigzag}
                                    saturation={config.saturation}
                                    diagonal={config.diagonal}
                                    depth={config.depth}
                                    cloudScale={config.cloudScale}
                                    flashDuration={config.flashDuration}
                                    boltDuration={config.boltDuration}
                                    boltGlow={config.boltGlow}
                                />
                            </div>
                        );
                    }
                    
                    return (
                        <div key={obj.id} className="absolute inset-0 pointer-events-none">
                             <PrismBackground
                                {...config}
                                transparent={true}
                                suspendWhenOffscreen={false}
                              />
                        </div>
                    );
                 })}
                 {sceneObjects.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/10 text-xl font-medium select-none pointer-events-none">
                        Empty Scene
                    </div>
                 )}
              </>
            )}
          </div>
      </div>

      <AnimatePresence>
        {isDebugMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              {/* --- Scroll Progress & FPS Tracker (Fixed Left) --- */}
              <div className="fixed top-24 left-6 z-10 pointer-events-none mix-blend-difference hidden md:flex flex-col gap-6">
                 <div className="flex flex-col gap-1 opacity-50">
                    <span className="text-[10px] uppercase tracking-widest font-bold">Animation</span>
                    <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all duration-75" style={{ width: `${scrollProgress * 100}%` }} />
                    </div>
                 </div>
                 <FpsTracker />
              </div>

              {/* --- Unified Scene Editor Panel (Fixed Right) --- */}
              <div className={`fixed bottom-6 right-6 z-10 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isPanelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3.5rem)]'}`}>
                <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] w-80 md:w-96 flex flex-col max-h-[70vh] overflow-hidden ring-1 ring-white/5">
                    <div 
                      className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 shrink-0 bg-white/5"
                      onClick={() => setIsPanelOpen(!isPanelOpen)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white/10 rounded-lg">
                              <Settings2 className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-sm tracking-wide text-white/90">
                                Scene Editor
                            </span>
                        </div>
                        {isPanelOpen ? <ChevronDown className="w-4 h-4 text-white/50" /> : <ChevronUp className="w-4 h-4 text-white/50" />}
                    </div>

                    {isPanelOpen && (
                        <div className="px-6 py-4 border-b border-white/5 shrink-0 space-y-4">
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

                            <div className="bg-white/5 rounded-lg p-3 space-y-2">
                                <div className="flex items-center justify-between text-white/60">
                                    <div className="flex items-center gap-2">
                                        <MoveVertical className="w-3 h-3" />
                                        <span className="text-[10px] uppercase font-bold tracking-wider">Hero Height</span>
                                    </div>
                                    <span className="text-[10px]">{scrollPixels}px</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="500" max="5000" step="100"
                                    value={scrollPixels}
                                    onChange={(e) => setScrollPixels(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                                />
                            </div>
                        </div>
                    )}

                    <div className="overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-black/20 flex-1 min-h-0">
                        {viewMode === 'single' ? (
                            <div className="p-6">
                                <ConfigControls config={singleConfig} onChange={updateSingleConfig} headerOffset={0} sectionHeaderClass="-mx-6 px-6" />
                            </div>
                        ) : (
                            <div className="p-4 space-y-4">
                                <div className="space-y-3 p-2">
                                     <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Add to Scene</label>
                                     <div className="grid grid-cols-4 gap-2">
                                        <AddButton icon={<Triangle className="w-4 h-4" />} label="Pyramid" onClick={() => addSceneObject('tetrahedron')} />
                                        <AddButton icon={<Box className="w-4 h-4" />} label="Cube" onClick={() => addSceneObject('cube')} />
                                        <AddButton icon={<Circle className="w-4 h-4" />} label="Sphere" onClick={() => addSceneObject('sphere')} />
                                        <AddButton icon={<Square className="w-4 h-4" />} label="Plane" onClick={() => addSceneObject('plane')} />
                                        <AddButton icon={<Type className="w-4 h-4" />} label="Text" onClick={() => addSceneObject('text')} />
                                        <AddButton icon={<CloudLightning className="w-4 h-4" />} label="Lightning" onClick={() => addSceneObject('lightning')} />
                                        <AddButton icon={<Cloud className="w-4 h-4" />} label="Atmos" onClick={() => addSceneObject('atmosphere')} />
                                     </div>
                                </div>

                                <div className="h-px bg-white/5 mx-2" />

                                <div className="space-y-3">
                                     {sceneObjects.map((obj, idx) => (
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
                                </div>
                            </div>
                        )}
                    </div>
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative w-full">
         <div style={{ height: `${scrollPixels}px` }} className="w-full pointer-events-none" />
         <div className="bg-white relative z-20 shadow-[0_-50px_100px_rgba(0,0,0,0.5)] rounded-t-3xl md:rounded-t-[4rem] overflow-hidden">
            {sortedSections.map(config => {
                const Component = config.Component;
                return <Component key={config.id} />
            })}
            <Footer />
         </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

// --- Subcomponents (Config UI) ---

function AddButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-1.5 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all group"
        >
            <div className="text-white/60 group-hover:text-white transition-colors">{icon}</div>
            <span className="text-[10px] font-medium text-white/40 group-hover:text-white/80 transition-colors">{label}</span>
        </button>
    )
}

function SectionHeader({ title, top, className = "" }: { title: string, top: number, className?: string }) {
    return (
        <div 
            className={`sticky z-20 bg-[#121212]/90 backdrop-blur-md border-y border-white/5 py-2 mb-3 shadow-sm flex items-center ${className}`}
            style={{ top: `${top}px` }}
        >
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{title}</span>
        </div>
    );
}

interface ConfigControlsProps {
    config: ConfigState;
    onChange: (key: keyof ConfigState, value: any) => void;
    headerOffset?: number;
    sectionHeaderClass?: string;
}

function ConfigControls({ config, onChange, headerOffset = 0, sectionHeaderClass = "" }: ConfigControlsProps) {
    const isStorm = config.shape === 'lightning' || config.shape === 'atmosphere';
    const isLightning = config.shape === 'lightning';
    const isAtmosphere = config.shape === 'atmosphere';
    const isText = config.shape === 'text';
    const isPlane = config.shape === 'plane';

    if (isStorm) {
        return (
            <div className="space-y-8">
                 <div className="space-y-3">
                    <SectionHeader title={isLightning ? "Lightning Settings" : "Atmosphere Settings"} top={headerOffset} className={sectionHeaderClass} />
                    
                    {isAtmosphere && (
                        <div className="space-y-5">
                            <ControlSlider label="HUE" param={config.hue} min={0} max={360} step={1} onChange={(v) => onChange('hue', v)} />
                            <ControlSlider label="SATURATION" param={config.saturation} min={0} max={1.0} step={0.05} onChange={(v) => onChange('saturation', v)} />
                            <ControlSlider label="CLOUDS" param={config.cloudiness} min={0} max={1.0} step={0.05} onChange={(v) => onChange('cloudiness', v)} />
                            <ControlSlider label="SCALE" param={config.cloudScale} min={0.1} max={5.0} step={0.1} onChange={(v) => onChange('cloudScale', v)} />
                            <ControlSlider label="WIND" param={config.speed} min={0} max={5.0} step={0.1} onChange={(v) => onChange('speed', v)} />
                        </div>
                    )}

                    {isLightning && (
                        <div className="space-y-5">
                            <ControlSlider label="HUE" param={config.hue} min={0} max={360} step={1} onChange={(v) => onChange('hue', v)} />
                            <ControlSlider label="INTENSITY" param={config.intensity} min={0.1} max={5.0} step={0.1} onChange={(v) => onChange('intensity', v)} />
                            <ControlSlider label="FREQUENCY" param={config.frequency} min={0.1} max={5.0} step={0.1} onChange={(v) => onChange('frequency', v)} />
                            <ControlSlider label="STRIKE FLASH" param={config.strikeIntensity} min={0} max={5.0} step={0.1} onChange={(v) => onChange('strikeIntensity', v)} />
                            <ControlSlider label="FLASH FADE" param={config.flashDuration} min={0.1} max={5.0} step={0.1} onChange={(v) => onChange('flashDuration', v)} />
                            <ControlSlider label="BOLT GLOW" param={config.boltGlow} min={0.1} max={5.0} step={0.1} onChange={(v) => onChange('boltGlow', v)} />
                            <ControlSlider label="BOLT WIDTH" param={config.boltWidth} min={0.1} max={5.0} step={0.1} onChange={(v) => onChange('boltWidth', v)} />
                            <ControlSlider label="BOLT DURATION" param={config.boltDuration} min={0.05} max={2.0} step={0.05} onChange={(v) => onChange('boltDuration', v)} />
                            <ControlSlider label="ZIGZAG" param={config.zigzag} min={0} max={2.0} step={0.1} onChange={(v) => onChange('zigzag', v)} />
                            <ControlSlider label="SKEW" param={config.diagonal} min={-1.0} max={1.0} step={0.05} onChange={(v) => onChange('diagonal', v)} />
                            <ControlSlider label="DEPTH VAR" param={config.depth} min={0} max={1.0} step={0.05} onChange={(v) => onChange('depth', v)} />
                        </div>
                    )}
                 </div>
                 
                 <div className="space-y-5">
                     <SectionHeader title="Position" top={headerOffset} className={sectionHeaderClass} />
                     <ControlSlider label="Offset Z" param={config.offsetZ} min={-500} max={500} step={10} onChange={(v) => onChange('offsetZ', v)} />
                 </div>
            </div>
        )
    }

    if (isText) {
        return (
             <div className="space-y-8">
                {/* Content Section */}
                <div className="space-y-5">
                    <SectionHeader title="Content & Tag" top={headerOffset} className={sectionHeaderClass} />
                    
                    <div className="space-y-3">
                         {/* Text Tag Selector */}
                         <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">HTML Tag</label>
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 flex-wrap gap-1">
                                {['h1', 'h2', 'h3', 'p', 'div'].map((tag) => (
                                    <button 
                                        key={tag}
                                        onClick={() => onChange('textTag', tag)}
                                        className={`flex-1 min-w-[30px] py-1.5 rounded-lg text-xs font-mono font-medium transition-all uppercase ${config.textTag === tag ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                         </div>
                         
                         <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Heading Text</label>
                            <input type="text" value={config.textHeading} onChange={e => onChange('textHeading', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors font-medium" />
                         </div>
                         
                         <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Label Text</label>
                            <input type="text" value={config.textLabel} onChange={e => onChange('textLabel', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                         </div>
                         
                         <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Subtitle Text</label>
                            <textarea rows={2} value={config.textSubtitle} onChange={e => onChange('textSubtitle', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                         </div>
                    </div>
                </div>

                {/* Typography Styling */}
                <div className="space-y-6">
                    <SectionHeader title="Typography Styles" top={headerOffset} className={sectionHeaderClass} />
                    
                    {/* Heading Styles */}
                    <div className="space-y-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest block border-b border-white/5 pb-2">Heading Style</label>
                        <div className="grid grid-cols-2 gap-3 mb-2">
                             <div>
                                <label className="text-[9px] text-white/40 block mb-1">Color (Hex/RGBA)</label>
                                <input type="text" value={config.headingColor} onChange={e => onChange('headingColor', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs font-mono text-white" />
                             </div>
                        </div>
                        <ControlSlider label="Size (px)" param={config.headingSize} min={20} max={300} step={1} onChange={(v) => onChange('headingSize', v)} />
                        <ControlSlider label="Spacing (em)" param={config.headingSpacing} min={-0.2} max={1.0} step={0.01} onChange={(v) => onChange('headingSpacing', v)} />
                        <ControlSlider label="Line Height" param={config.headingHeight} min={0.5} max={2.0} step={0.05} onChange={(v) => onChange('headingHeight', v)} />
                    </div>

                    {/* Label Styles */}
                    <div className="space-y-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest block border-b border-white/5 pb-2">Label Style</label>
                        <div>
                            <label className="text-[9px] text-white/40 block mb-1">Color</label>
                            <input type="text" value={config.labelColor} onChange={e => onChange('labelColor', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs font-mono text-white mb-3" />
                        </div>
                        <ControlSlider label="Size (px)" param={config.labelSize} min={8} max={40} step={1} onChange={(v) => onChange('labelSize', v)} />
                        <ControlSlider label="Spacing (em)" param={config.labelSpacing} min={-0.1} max={1.0} step={0.05} onChange={(v) => onChange('labelSpacing', v)} />
                    </div>

                    {/* Subtitle Styles */}
                    <div className="space-y-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest block border-b border-white/5 pb-2">Subtitle Style</label>
                        <div>
                            <label className="text-[9px] text-white/40 block mb-1">Color</label>
                            <input type="text" value={config.subColor} onChange={e => onChange('subColor', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs font-mono text-white mb-3" />
                        </div>
                        <ControlSlider label="Size (px)" param={config.subSize} min={10} max={60} step={1} onChange={(v) => onChange('subSize', v)} />
                    </div>
                </div>

                <div className="space-y-3">
                    <SectionHeader title="Alignment" top={headerOffset} className={sectionHeaderClass} />
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                        {['left', 'center', 'right'].map((align) => (
                            <button 
                                key={align}
                                onClick={() => onChange('textAlign', align)}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize ${config.textAlign === align ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                            >
                                {align}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-5">
                     <SectionHeader title="Global Transform" top={headerOffset} className={sectionHeaderClass} />
                     <ControlSlider label="Scale" param={config.scale} min={50} max={200} step={1} onChange={(v) => onChange('scale', v)} />
                     <ControlSlider label="Offset X" param={config.offsetX} min={-500} max={500} step={10} onChange={(v) => onChange('offsetX', v)} />
                     <ControlSlider label="Offset Y" param={config.offsetY} min={-500} max={500} step={10} onChange={(v) => onChange('offsetY', v)} />
                     <ControlSlider label="Offset Z" param={config.offsetZ} min={-500} max={500} step={10} onChange={(v) => onChange('offsetZ', v)} />
                     <ControlSlider label="Opacity" param={config.opacity} min={0} max={1} step={0.05} onChange={(v) => onChange('opacity', v)} />
                </div>
             </div>
        );
    }

    return (
        <div className="space-y-8">
             {/* Geometry Mode */}
             <div className="space-y-3">
                <SectionHeader title="Geometry Mode" top={headerOffset} className={sectionHeaderClass} />
                <div className="grid grid-cols-4 gap-2">
                    {['tetrahedron', 'cube', 'sphere', 'plane', 'cylinder', 'torus', 'column'].map((shape) => (
                        <button
                            key={shape}
                            onClick={() => onChange('shape', shape)}
                            className={`px-2 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                                config.shape === shape 
                                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.02]' 
                                : 'bg-white/5 text-white/60 border-transparent hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {shape.charAt(0).toUpperCase() + shape.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plane Texture Controls */}
            {isPlane && (
                <div className="space-y-5">
                    <SectionHeader title="Texture" top={headerOffset} className={sectionHeaderClass} />
                    <div className="space-y-3">
                        <div>
                             <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Image URL</label>
                             <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                                    <input 
                                        type="text" 
                                        value={config.textureUrl} 
                                        onChange={e => onChange('textureUrl', e.target.value)} 
                                        placeholder="https://..."
                                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-colors" 
                                    />
                                </div>
                             </div>
                        </div>
                        
                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Sizing</label>
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                                {['cover', 'contain', 'native'].map((mode) => (
                                    <button 
                                        key={mode}
                                        onClick={() => onChange('sizingMode', mode)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize ${config.sizingMode === mode ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Animation Type */}
            <div className="space-y-3">
                <SectionHeader title="Animation Mode" top={headerOffset} className={sectionHeaderClass} />
                <div className="grid grid-cols-2 gap-2">
                    {['rotate', 'hover', '3drotate', 'static'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => onChange('animationType', mode)}
                            className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                                config.animationType === mode 
                                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.02]' 
                                : 'bg-white/5 text-white/60 border-transparent hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {mode === '3drotate' ? '3D Rotate' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Static Rotation Controls */}
            {config.animationType === 'static' && (
                <div className="space-y-5">
                    <SectionHeader title="Static Rotation" top={headerOffset} className={sectionHeaderClass} />
                    <ControlSlider label="Rotate X" param={config.rotateX} min={-3.14} max={3.14} step={0.01} onChange={(v) => onChange('rotateX', v)} />
                    <ControlSlider label="Rotate Y" param={config.rotateY} min={-3.14} max={3.14} step={0.01} onChange={(v) => onChange('rotateY', v)} />
                    <ControlSlider label="Rotate Z" param={config.rotateZ} min={-3.14} max={3.14} step={0.01} onChange={(v) => onChange('rotateZ', v)} />
                </div>
            )}

            {/* Geometry Section */}
            <div className="space-y-5">
                 <SectionHeader title="Geometry" top={headerOffset} className={sectionHeaderClass} />
                 <ControlSlider label="Scale" param={config.scale} min={10} max={500} step={1} onChange={(v) => onChange('scale', v)} />
                 <ControlSlider label="Height" param={config.height} min={0.1} max={10} step={0.1} onChange={(v) => onChange('height', v)} />
                 <ControlSlider label="Base Width" param={config.baseWidth} min={0.1} max={10} step={0.1} onChange={(v) => onChange('baseWidth', v)} />
            </div>

            {/* Appearance Section */}
            <div className="space-y-5">
                 <SectionHeader title="Appearance" top={headerOffset} className={sectionHeaderClass} />
                 <ControlSlider label="Glow" param={config.glow} min={0} max={5} step={0.1} onChange={(v) => onChange('glow', v)} />
                 <ControlSlider label="Bloom" param={config.bloom} min={0} max={5} step={0.1} onChange={(v) => onChange('bloom', v)} />
                 <ControlSlider label="Noise" param={config.noise} min={0} max={1} step={0.01} onChange={(v) => onChange('noise', v)} />
                 <ControlSlider label="Hue Shift" param={config.hueShift} min={0} max={6.28} step={0.1} onChange={(v) => onChange('hueShift', v)} />
                 <ControlSlider label="Color Freq" param={config.colorFrequency} min={0} max={10} step={0.1} onChange={(v) => onChange('colorFrequency', v)} />
                 <ControlSlider label="Saturation" param={config.saturation} min={0} max={3} step={0.1} onChange={(v) => onChange('saturation', v)} />
                 <ControlSlider label="Rainbow" param={config.rainbow} min={0} max={5} step={0.1} onChange={(v) => onChange('rainbow', v)} />
                 <ControlSlider label="Density" param={config.density} min={0.05} max={1} step={0.05} onChange={(v) => onChange('density', v)} />
                 <ControlSlider label="Opacity" param={config.opacity} min={0} max={1} step={0.05} onChange={(v) => onChange('opacity', v)} />
            </div>

            {/* Motion Section */}
            <div className="space-y-5">
                 <SectionHeader title="Motion" top={headerOffset} className={sectionHeaderClass} />
                 <ControlSlider label="Time Scale" param={config.timeScale} min={0} max={5} step={0.1} onChange={(v) => onChange('timeScale', v)} />
                 {config.animationType === 'hover' && (
                    <>
                       <ControlSlider label="Hover Strength" param={config.hoverStrength} min={0.1} max={10} step={0.1} onChange={(v) => onChange('hoverStrength', v)} />
                       <ControlSlider label="Inertia" param={config.inertia} min={0.01} max={0.99} step={0.01} onChange={(v) => onChange('inertia', v)} />
                    </>
                 )}
            </div>

            {/* Position Section */}
            <div className="space-y-5">
                 <SectionHeader title="Position" top={headerOffset} className={sectionHeaderClass} />
                 <ControlSlider label="Offset X" param={config.offsetX} min={-500} max={500} step={10} onChange={(v) => onChange('offsetX', v)} />
                 <ControlSlider label="Offset Y" param={config.offsetY} min={-500} max={500} step={10} onChange={(v) => onChange('offsetY', v)} />
                 <ControlSlider label="Offset Z" param={config.offsetZ} min={-500} max={500} step={10} onChange={(v) => onChange('offsetZ', v)} />
            </div>
        </div>
    );
}

const ControlSlider = ({ label, param, min, max, step, onChange }: { label: string, param: NumberParam, min: number, max: number, step: number, onChange: (val: NumberParam) => void }) => {
    const [dragging, setDragging] = useState<'primary' | 'secondary' | null>(null);

    // We treat 'value' as Start and 'endValue' as End.
    const hasEnd = param.endValue !== null;

    // Helper to clamp
    const clamp = (v: number) => Math.min(Math.max(v, min), max);
    
    // Calculate percentages for sliders
    const toPercent = (v: number) => ((clamp(v) - min) / (max - min)) * 100;
    
    const handleSliderChange = (newVal: number, isSecondary: boolean) => {
        const c = clamp(newVal);
        if (isSecondary) {
            onChange({ ...param, endValue: c });
        } else {
            onChange({ ...param, value: c });
        }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);

        const rect = e.currentTarget.getBoundingClientRect();
        // Calculate raw value
        const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const val = min + pct * (max - min);

        // Determine which handle to target
        let target: 'primary' | 'secondary' = 'primary';

        if (e.shiftKey) {
            // Shift always targets secondary (or creates it)
            target = 'secondary';
        } else if (hasEnd) {
            // If both exist, find closest
            const distPrimary = Math.abs(val - param.value);
            const distSecondary = Math.abs(val - param.endValue!);
            if (distSecondary < distPrimary) {
                target = 'secondary';
            }
        }

        // Apply change immediately
        setDragging(target);
        handleSliderChange(val, target === 'secondary');
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const val = min + pct * (max - min);

        handleSliderChange(val, dragging === 'secondary');
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        setDragging(null);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    const toggleLink = () => {
        onChange({ ...param, isLinked: !param.isLinked });
    };

    const removeEndValue = () => {
        onChange({ ...param, endValue: null, isLinked: false }); // Unlink if removing end point
    };
    
    const swapValues = () => {
        if (hasEnd) {
             onChange({
                ...param,
                value: param.endValue!,
                endValue: param.value
            });
        }
    };

    // --- Inline Input Component ---
    const NumberInput = ({ val, onUpdate }: { val: number, onUpdate: (n: number) => void }) => {
        const [text, setText] = useState(val.toFixed(2));
        const [editing, setEditing] = useState(false);

        useEffect(() => { if(!editing) setText(val.toFixed(2)) }, [val, editing]);

        const commit = () => {
            setEditing(false);
            const n = parseFloat(text);
            if (!isNaN(n)) onUpdate(n);
            else setText(val.toFixed(2));
        };

        return editing ? (
            <input 
                autoFocus
                type="text" 
                value={text}
                onChange={e => setText(e.target.value)}
                onBlur={commit}
                onKeyDown={e => e.key === 'Enter' && commit()}
                className="w-14 bg-white/20 text-white text-[10px] font-mono px-1 py-0.5 rounded text-right outline-none"
            />
        ) : (
            <span 
                onClick={() => setEditing(true)}
                className="cursor-text hover:bg-white/10 px-1 py-0.5 rounded text-[10px] font-mono text-white/50 hover:text-white transition-colors min-w-[3ch] text-right"
            >
                {val.toFixed(2)}
            </span>
        );
    }

    return (
        <div className={`flex flex-col gap-3 group p-2 rounded-xl transition-colors ${param.isLinked ? 'bg-white/5 border border-white/5' : 'hover:bg-white/5 border border-transparent'}`}>
            <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                    {/* Link Toggle */}
                    <button 
                        onClick={toggleLink}
                        title="Link to Scroll"
                        className={`p-1 rounded transition-all ${param.isLinked ? 'bg-blue-500/20 text-blue-400' : 'text-white/20 hover:text-white/60'}`}
                    >
                        {param.isLinked ? <Link2 className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
                    </button>
                    <span className={`font-medium transition-colors ${param.isLinked ? 'text-blue-200' : 'text-white/60 group-hover:text-white/90'}`}>
                        {label}
                    </span>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Primary Input */}
                    <NumberInput val={param.value} onUpdate={n => handleSliderChange(n, false)} />
                    
                    {/* Secondary Input & Delete */}
                    {hasEnd && (
                        <>
                            <button 
                                onClick={swapValues}
                                className="text-white/20 hover:text-white transition-colors p-0.5"
                                title="Reverse Direction"
                            >
                                {param.endValue! >= param.value ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
                            </button>
                            <NumberInput val={param.endValue!} onUpdate={n => handleSliderChange(n, true)} />
                            <button onClick={removeEndValue} className="text-white/20 hover:text-red-400 p-0.5 transition-colors" title="Remove End Point">
                                <X className="w-3 h-3" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div 
                className="relative h-2 w-full cursor-pointer touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                {/* Track Background */}
                <div className="absolute inset-0 rounded-full bg-white/10 overflow-hidden pointer-events-none">
                    {/* Range Fill (if two points) */}
                    {hasEnd ? (
                        <div 
                           className={`absolute h-full opacity-30 transition-all duration-75 ${param.isLinked ? 'bg-blue-400' : 'bg-white'}`}
                           style={{ 
                               left: `${Math.min(toPercent(param.value), toPercent(param.endValue!))}%`,
                               width: `${Math.abs(toPercent(param.endValue!) - toPercent(param.value))}%` 
                           }}
                        />
                    ) : (
                        <div 
                            className={`h-full transition-all duration-75 ease-out ${param.isLinked ? 'bg-blue-500/50' : 'bg-white/80'}`}
                            style={{ width: `${toPercent(param.value)}%` }}
                        />
                    )}
                </div>

                {/* Primary Handle */}
                <div 
                    className={`absolute top-1/2 -ml-1.5 -mt-1.5 w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none transition-all duration-75 ease-out border border-black/20 ${param.isLinked ? 'bg-blue-400 scale-110' : 'bg-white group-hover:scale-125'}`}
                    style={{ left: `${toPercent(param.value)}%` }}
                />

                {/* Secondary Handle */}
                {hasEnd && (
                    <div 
                        className={`absolute top-1/2 -ml-1.5 -mt-1.5 w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none transition-all duration-75 ease-out border border-black/20 bg-white/50 border-white/50`}
                        style={{ left: `${toPercent(param.endValue!)}%` }}
                    />
                )}
            </div>
            
            {/* Instruction Hint (Only shows on hover if not configured) */}
            {!hasEnd && !param.isLinked && (
                 <div className="hidden group-hover:block text-[9px] text-white/20 text-center -mt-1">
                    Shift+Click to add end point
                 </div>
            )}
        </div>
    );
}