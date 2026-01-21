import { ConfigState, NumberParam, SceneObject, SectionConfig } from './types';

// --- Content Data ---
export const projects = [
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

export const sliderImages = [
  "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=2500&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2500&auto=format&fit=crop", 
];

// --- Helper Functions ---
export const mkParam = (val: number): NumberParam => ({ value: val, endValue: null, isLinked: false });

export const DEFAULT_CONFIG: ConfigState = {
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

  // Marquee Props (Legacy)
  marqueeSpeed: mkParam(1.0),
  marqueeDirection: mkParam(1.0),

  // Storm Defaults
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
  
  // Tile Defaults
  tileHeading: 'Heading',
  tileLabel: 'Label',
  tileSubtitle: 'Subtitle',
  tileTrailing: '',
  tileTrailingIcon: '',
  tileAlign: 'center',
  tileTag: 'h1',
  
  // Leading Model (New)
  leadingPlacement: 'none',
  leadingKind: 'icon',
  leadingIcon: '',
  leadingImage: '',
  leadingSize: mkParam(40),
  leadingGap: mkParam(12),
  leadingOpacity: mkParam(1),
  leadingRadius: mkParam(0),
  leadingFit: 'cover',

  // Typography Defaults
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
  sizingMode: 'cover',
  borderRadius: mkParam(0),

  // Card Defaults
  cardWidth: mkParam(400),
  cardHeight: mkParam(560),
  cardRadius: '40px',
  cardBackground: '#ffffff',
  cardPadding: mkParam(0),
  cardBorder: 'none',
  
  // Card M3 New Defaults
  cardElevation: mkParam(0),
  cardOpacity: mkParam(1),
  cardClip: true,
  cardMediaSrc: '',
  cardMediaFit: 'cover',
  cardMediaHeight: mkParam(200),
  cardBorderWidth: mkParam(0),
  cardBorderColor: '#ffffff',

  // List / Collection Defaults
  listLayout: 'stack',
  listTemplate: {}, 
  listItems: [],
  listCount: mkParam(100),
  listGap: mkParam(24),
  listColumns: mkParam(3),
  listRows: mkParam(2),
  listPage: mkParam(0),
  listSpeed: mkParam(1.0),
  listDirection: mkParam(1.0),
  listRadiusPattern: '', // New pattern string
  
  marqueeHoverPause: true,
  itemHoverScale: mkParam(1.05),
  itemBaseGrayscale: mkParam(0),
  itemHoverGrayscale: mkParam(0),
  listSmoothness: mkParam(0.1),
  
  bufferPx: mkParam(100),
  containerOverflow: 'visible',
  itemOverflow: 'visible',
  clipWithinSection: false
};

export const createObj = (overrides: Partial<SceneObject>): SceneObject => {
  const base = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  // Ensure template exists if creating a list
  if (overrides.shape === 'list' && !overrides.listTemplate) {
      overrides.listTemplate = { shape: 'card' }; // Default template
  }
  return { 
      ...base, 
      ...overrides, 
      id: Math.random().toString(36).substr(2, 9), 
      isExpanded: overrides.isExpanded ?? false,
      children: overrides.children || []
  };
};

export const getHeroObjects = (): SceneObject[] => [
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

export const getUseCasesObjects = (): SceneObject[] => [
  createObj({
      shape: 'tile',
      tileHeading: "We're Superdesign® — a creative studio cultivating bold brands, beautiful websites, and ideas that refuse to be ordinary.",
      tileTag: 'h2',
      headingSize: mkParam(48),
      headingHeight: mkParam(1.1),
      headingColor: '#000000',
      tileAlign: 'center',
      offsetY: mkParam(-100)
  }),
  createObj({
      shape: 'list',
      listLayout: 'grid',
      listColumns: mkParam(4),
      listGap: mkParam(40),
      offsetY: mkParam(150),
      listTemplate: {
          shape: 'tile',
          tileAlign: 'center',
          headingColor: '#737373',
          headingSize: mkParam(24),
          leadingPlacement: 'left',
          leadingKind: 'icon',
          leadingSize: mkParam(24),
          leadingGap: mkParam(12),
          animationType: 'static'
      },
      listItems: [
          { tileHeading: 'Blob', leadingIcon: 'Circle' },
          { tileHeading: 'Yallo!', leadingIcon: 'Hexagon' },
          { tileHeading: 'Bliss+', leadingIcon: 'Square' },
          { tileHeading: 'Flea', leadingIcon: 'Triangle' }
      ]
  })
];

export const getProductsObjects = (): SceneObject[] => {
  // Use unique set of images (6 items)
  // The renderer handles endless loop tiling
  const overrides = sliderImages.map((src) => ({
      textureUrl: src
  }));

  return [createObj({
      shape: 'list',
      listLayout: 'marquee',
      
      // Speed matching 30s CSS animation for ~5000px width => ~170px/s
      // Render engine uses (speed * 60) px/s. 2.8 * 60 = 168.
      listSpeed: mkParam(2.8), 
      listDirection: mkParam(-1.0), // Move Left
      listGap: mkParam(32), // md:gap-8 (32px)
      clipWithinSection: true,
      offsetY: mkParam(0),
      marqueeHoverPause: true, 
      
      // Fine-grained Hover Effects
      itemHoverScale: mkParam(1.05),
      itemBaseGrayscale: mkParam(1.0), // Start grayscale
      itemHoverGrayscale: mkParam(0.0), // Hover color
      listSmoothness: mkParam(0.1),
      
      // Exact Pattern from Reference:
      // 0: rounded-tl-[100px] -> 100px 0 0 0
      // 1: rounded-tr-[100px] rounded-bl-[40px] -> 0 100px 0 40px
      // 2: rounded-[40px] -> 40px
      listRadiusPattern: '100px 0 0 0 | 0 100px 0 40px | 40px',

      listTemplate: {
          shape: 'card',
          // Desktop Sizes (Reference: w-[400px] h-[560px])
          // MarqueeRenderer handles mobile responsive override (280x400) automatically
          cardWidth: mkParam(400),
          cardHeight: mkParam(560),
          cardBackground: '#ffffff',
          cardElevation: mkParam(0),
          sizingMode: 'cover',
          cardRadius: '0px' // Overridden by pattern
      },
      listItems: overrides
  })];
};

export const getFeaturesObjects = (): SceneObject[] => {
    return []; 
};

export const INITIAL_SECTIONS: Record<string, SectionConfig> = {
  hero: { id: 'hero', height: 1500, pinHeight: 800, objects: getHeroObjects() },
  UseCases: { id: 'UseCases', height: 1600, pinHeight: 800, objects: getUseCasesObjects() },
  Products: { id: 'Products', height: 1200, pinHeight: 800, objects: getProductsObjects() }, 
  Features: { id: 'Features', height: 1000, pinHeight: 800, objects: [] },
  Solutions: { id: 'Solutions', height: 1200, pinHeight: 800, objects: [] },
  CTA: { id: 'CTA', height: 800, pinHeight: 800, objects: [] }
};
