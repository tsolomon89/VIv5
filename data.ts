
import { ConfigState, NumberParam, SceneObject, SectionConfig, PageTemplate } from './types';

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
  tileHeading: '',
  tileLabel: '',
  tileSubtitle: '',
  tileTrailing: '',
  tileTrailingIcon: '',
  tileAlign: 'center',
  tileTag: 'div',
  
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
  const overrides = sliderImages.map((src) => ({
      textureUrl: src
  }));

  return [createObj({
      shape: 'list',
      listLayout: 'marquee',
      listSpeed: mkParam(2.8), 
      listDirection: mkParam(-1.0),
      listGap: mkParam(32),
      clipWithinSection: true,
      offsetY: mkParam(0),
      marqueeHoverPause: true, 
      itemHoverScale: mkParam(1.05),
      itemBaseGrayscale: mkParam(1.0),
      itemHoverGrayscale: mkParam(0.0),
      listSmoothness: mkParam(0.1),
      listRadiusPattern: '100px 0 0 0 | 0 100px 0 40px | 40px',
      listTemplate: {
          shape: 'card',
          cardWidth: mkParam(400),
          cardHeight: mkParam(560),
          cardBackground: '#ffffff',
          cardElevation: mkParam(0),
          sizingMode: 'cover',
          cardRadius: '0px'
      },
      listItems: overrides
  })];
};

export const getFeaturesObjects = (): SceneObject[] => [
    // Header
    createObj({
        shape: 'tile',
        offsetY: mkParam(-400),
        offsetX: mkParam(-200), // Left align roughly
        tileAlign: 'left',
        tileHeading: 'Latest Projects.',
        tileTag: 'h2',
        headingSize: mkParam(64),
        headingColor: '#000000',
        tileTrailing: '( _04 )'
    }),
    // Grid
    createObj({
        shape: 'list',
        listLayout: 'grid',
        listColumns: mkParam(2),
        listGap: mkParam(48), // gap-12
        listCount: mkParam(4),
        offsetY: mkParam(100),
        listTemplate: {
            shape: 'card',
            cardWidth: mkParam(500),
            cardHeight: mkParam(450), // Aspect 4/3 ish
            cardBackground: '#f5f5f5', // neutral-100
            cardRadius: '4px',
            tileTag: 'h3',
            headingSize: mkParam(24),
            headingColor: '#000000',
            subColor: '#737373', // neutral-500
            cardMediaHeight: mkParam(360), // Top image area
            cardMediaFit: 'cover',
            cardPadding: mkParam(0),
            tileAlign: 'left',
            animationType: 'static'
        },
        listItems: projects.map(p => ({
            cardMediaSrc: p.image,
            tileHeading: p.title,
            tileSubtitle: p.category,
            tileTrailing: p.year
        }))
    })
];

export const getSolutionsObjects = (): SceneObject[] => [
    // Header
    createObj({
        shape: 'tile',
        offsetY: mkParam(-400),
        tileAlign: 'left',
        tileLabel: '/ SERVICES',
        labelColor: '#a3a3a3', // neutral-400
        tileHeading: 'Our Expertise.',
        headingSize: mkParam(60),
        headingColor: '#000000',
        tileSubtitle: 'We combine strategic thinking with design excellence to create brands that stand out in a crowded digital landscape.',
        subColor: '#737373',
        subSize: mkParam(16)
    }),
    // Services Grid
    createObj({
        shape: 'list',
        listLayout: 'grid',
        listColumns: mkParam(3),
        listGap: mkParam(32),
        offsetY: mkParam(100),
        listTemplate: {
            shape: 'card',
            cardWidth: mkParam(350),
            cardHeight: mkParam(350),
            cardBackground: '#ffffff',
            cardBorder: '1px solid rgba(0,0,0,0.05)',
            cardRadius: '16px',
            cardPadding: mkParam(32),
            cardElevation: mkParam(1),
            // Leading Icon Styling
            leadingPlacement: 'above',
            leadingKind: 'icon',
            leadingSize: mkParam(48),
            leadingGap: mkParam(24),
            // Text Styling
            tileAlign: 'left',
            headingSize: mkParam(20),
            headingColor: '#000000',
            subSize: mkParam(16),
            subColor: '#737373'
        },
        listItems: [
            { 
                leadingIcon: 'Hexagon', 
                tileHeading: 'Brand Identity', 
                tileSubtitle: 'Crafting distinct visual languages that resonate with your audience and stand the test of time.'
            },
            { 
                leadingIcon: 'Square', 
                tileHeading: 'Digital Products', 
                tileSubtitle: 'Building robust, scalable web applications with cutting-edge technologies and seamless UX.'
            },
            { 
                leadingIcon: 'Triangle', 
                tileHeading: 'Motion Design', 
                tileSubtitle: 'Bringing static interfaces to life with fluid animations and interactive 3D experiences.'
            }
        ]
    })
];

export const getCTAObjects = (): SceneObject[] => [
    // Background Globs (simulated with large soft spheres/glows)
    createObj({
        shape: 'sphere',
        scale: mkParam(500), // Huge
        opacity: mkParam(0.3),
        glow: mkParam(2),
        bloom: mkParam(2),
        offsetX: mkParam(400),
        offsetY: mkParam(-400),
        animationType: 'rotate',
        colorFrequency: mkParam(0.5)
    }),
    createObj({
        shape: 'sphere',
        scale: mkParam(400),
        opacity: mkParam(0.2),
        glow: mkParam(1.5),
        bloom: mkParam(1),
        offsetX: mkParam(-400),
        offsetY: mkParam(400),
        hueShift: mkParam(3.14),
        animationType: 'rotate'
    }),
    // Content
    createObj({
        shape: 'tile',
        tileAlign: 'center',
        // "Open for new collaborations" pill simulation
        tileLabel: '✨ Open for new collaborations',
        labelColor: 'rgba(255,255,255,0.8)',
        labelSize: mkParam(14),
        
        tileHeading: 'Ready to start?',
        headingSize: mkParam(80),
        headingColor: '#ffffff',
        
        tileSubtitle: "Let's build something extraordinary together. Reach out to discuss your next project.",
        subColor: 'rgba(255,255,255,0.6)',
        subSize: mkParam(20)
    }),
    // Button Simulation
    createObj({
        shape: 'card',
        cardWidth: mkParam(200),
        cardHeight: mkParam(60),
        cardBackground: '#ffffff',
        cardRadius: '30px',
        offsetY: mkParam(200),
        tileHeading: 'Get in touch',
        headingColor: '#000000',
        headingSize: mkParam(18),
        tileAlign: 'center'
    })
];

export const INITIAL_SECTIONS: Record<string, SectionConfig> = {
  hero: { id: 'hero', height: 1500, pinHeight: 800, objects: getHeroObjects() },
  UseCases: { id: 'UseCases', height: 1600, pinHeight: 800, objects: getUseCasesObjects() },
  Products: { id: 'Products', height: 1200, pinHeight: 800, objects: getProductsObjects() }, 
  Features: { id: 'Features', height: 1400, pinHeight: 800, objects: getFeaturesObjects() },
  Solutions: { id: 'Solutions', height: 1200, pinHeight: 800, objects: getSolutionsObjects() },
  CTA: { id: 'CTA', height: 800, pinHeight: 800, objects: getCTAObjects() }
};

// --- INITIAL PAGE TEMPLATE (v1.1 Data Model) ---
export const INITIAL_PAGE_TEMPLATE: PageTemplate = {
    schemaVersion: 1,
    id: 'demo-landing',
    name: 'Demo Landing Page',
    pageContext: { kind: 'detail' }, 
    pageSubject: { target: 'brand', cardinality: 'one' }, 
    
    sections: [
        {
            schemaVersion: 1,
            id: 'hero-section',
            placement: { slot: 'start' },
            binding: { kind: 'self' },
            presentationKey: 'self.hero.v1',
            overrides: {} 
        },
        {
            schemaVersion: 1,
            id: 'use-cases-section',
            placement: { slot: 'free', order: 1 },
            binding: { kind: 'self' }, 
            presentationKey: 'section.generic.v1',
            overrides: {} 
        },
        {
            schemaVersion: 1,
            id: 'products-section',
            placement: { slot: 'free', order: 2 },
            binding: { kind: 'self' },
            presentationKey: 'section.generic.v1',
            overrides: {} 
        },
        {
            schemaVersion: 1,
            id: 'features-section',
            placement: { slot: 'free', order: 3 },
            binding: { kind: 'self' },
            presentationKey: 'section.generic.v1',
            overrides: {} 
        },
        {
            schemaVersion: 1,
            id: 'solutions-section',
            placement: { slot: 'free', order: 4 },
            binding: { kind: 'self' },
            presentationKey: 'section.generic.v1',
            overrides: {} 
        },
        {
            schemaVersion: 1,
            id: 'cta-section',
            placement: { slot: 'end' },
            binding: { kind: 'self' },
            presentationKey: 'section.generic.v1',
            overrides: {} 
        }
    ]
};

// --- MINIMAL PAGE TEMPLATE (For Switching) ---
export const MINIMAL_PAGE_TEMPLATE: PageTemplate = {
    schemaVersion: 1,
    id: 'minimal-landing',
    name: 'Minimal Landing Page',
    pageContext: { kind: 'detail' }, 
    pageSubject: { target: 'brand', cardinality: 'one' }, 
    
    sections: [
        {
            schemaVersion: 1,
            id: 'hero-section',
            placement: { slot: 'start' },
            binding: { kind: 'self' },
            presentationKey: 'self.hero.v1',
            overrides: {} 
        },
        {
            schemaVersion: 1,
            id: 'cta-section',
            placement: { slot: 'end' },
            binding: { kind: 'self' },
            presentationKey: 'self.cta.v1', // Using dedicated CTA preset logic if available
            overrides: {} 
        }
    ]
};

export const TEMPLATES: Record<string, PageTemplate> = {
    'demo-landing': INITIAL_PAGE_TEMPLATE,
    'minimal-landing': MINIMAL_PAGE_TEMPLATE
};
