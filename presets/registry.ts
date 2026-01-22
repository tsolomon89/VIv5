
import { PresentationPreset, PresetRegistry, SceneObject, ConfigState } from '../types';
import { DEFAULT_CONFIG, mkParam, sliderImages, projects, createObj } from '../data';

// --- Helper for creating base objects within presets ---
const base = (overrides: Partial<ConfigState>): SceneObject => ({
    ...JSON.parse(JSON.stringify(DEFAULT_CONFIG)),
    ...overrides,
    id: `preset-${Math.random().toString(36).substr(2, 5)}`,
    isExpanded: false
});

// 1. HERO PRESET (5 Objects: 4 Geom + 1 Text)
export const heroPreset: PresentationPreset = {
    key: 'self.hero.v1',
    signature: { kind: 'self' },
    config: {
        ...DEFAULT_CONFIG,
        className: "bg-[#1A1A1B]", // Dark background for Hero
        shape: 'group', // Logical container
        children: [
            base({
                shape: 'tetrahedron',
                animationType: 'static',
                rotateX: mkParam(0), rotateY: mkParam(0), rotateZ: mkParam(0),
                scale: mkParam(100), height: mkParam(2), baseWidth: mkParam(2),
                glow: mkParam(1), bloom: mkParam(1), noise: mkParam(0.02),
                hueShift: mkParam(1.90), colorFrequency: mkParam(1),
                saturation: mkParam(1.1), rainbow: mkParam(1), density: mkParam(0.2),
                opacity: mkParam(1), timeScale: mkParam(0.5),
                offsetX: mkParam(0), offsetY: mkParam(-346.04),
            }),
            base({
                shape: 'tetrahedron',
                animationType: 'static',
                rotateX: mkParam(0), rotateY: mkParam(0), rotateZ: mkParam(3.14),
                scale: mkParam(100), height: mkParam(6.94), baseWidth: mkParam(2.49),
                glow: mkParam(0.72), bloom: mkParam(1.5), noise: mkParam(0.02),
                hueShift: mkParam(6.07), colorFrequency: mkParam(0.59),
                saturation: mkParam(2.14), rainbow: mkParam(4.64), density: mkParam(0.14),
                opacity: mkParam(1), timeScale: mkParam(0.5),
                offsetX: mkParam(0), offsetY: mkParam(171.83),
            }),
            base({
                shape: 'sphere',
                animationType: 'static',
                scale: mkParam(200), height: mkParam(1), baseWidth: mkParam(2),
                glow: mkParam(1), bloom: mkParam(1), noise: mkParam(0.03),
                hueShift: mkParam(4.40), colorFrequency: mkParam(1),
                saturation: mkParam(1.1), rainbow: mkParam(1), density: mkParam(0.2),
                opacity: mkParam(1), timeScale: mkParam(0.5),
                offsetX: mkParam(-100), offsetY: mkParam(0),
            }),
            base({
                shape: 'sphere',
                animationType: 'static',
                scale: mkParam(200), height: mkParam(1), baseWidth: mkParam(2),
                glow: mkParam(1), bloom: mkParam(1), noise: mkParam(0.03),
                hueShift: mkParam(4.40), colorFrequency: mkParam(1),
                saturation: mkParam(1.1), rainbow: mkParam(1), density: mkParam(0.2),
                opacity: mkParam(1), timeScale: mkParam(0.5),
                offsetX: mkParam(100), offsetY: mkParam(0),
            }),
            // Added Text Tile for Binding Data Injection
            base({
                shape: 'tile',
                tileAlign: 'center',
                tileHeading: 'Brand Name', // Placeholder
                tileSubtitle: 'Brand Description', // Placeholder
                headingSize: mkParam(120),
                headingColor: '#ffffff',
                subColor: 'rgba(255,255,255,0.6)',
                offsetY: mkParam(0),
                offsetX: mkParam(0)
            })
        ]
    }
};

// 2. USE CASES PRESET (Header + Grid)
export const useCaseGridPreset: PresentationPreset = {
    key: 'related.useCase.many.grid.v1',
    signature: { kind: 'related', target: 'useCase', cardinality: 'many' },
    config: {
        ...DEFAULT_CONFIG,
        className: "bg-white",
        shape: 'group',
        children: [
            base({
                shape: 'tile',
                tileHeading: "We're Superdesign® — a creative studio cultivating bold brands, beautiful websites, and ideas that refuse to be ordinary.",
                tileTag: 'h2',
                headingSize: mkParam(48), headingHeight: mkParam(1.1), headingColor: '#000000',
                tileAlign: 'center', offsetY: mkParam(-100)
            }),
            base({
                shape: 'list',
                listLayout: 'grid',
                listColumns: mkParam(4),
                listGap: mkParam(40),
                offsetY: mkParam(150),
                renderPolicy: { virtualization: 'none', overscanPx: 100 },
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
                }
            })
        ]
    }
};

// 3. PRODUCTS PRESET (Marquee)
export const productMarqueePreset: PresentationPreset = {
    key: 'related.product.many.marquee.v1',
    signature: { kind: 'related', target: 'product', cardinality: 'many' },
    config: {
        ...DEFAULT_CONFIG,
        className: "bg-white",
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
        renderPolicy: { virtualization: 'window', overscanPx: 500, maxItems: 20, renderer: 'webgl' },
        listTemplate: {
            shape: 'card',
            cardWidth: mkParam(400),
            cardHeight: mkParam(560),
            cardBackground: '#ffffff',
            cardElevation: mkParam(0),
            sizingMode: 'cover',
            cardRadius: '0px'
        },
    }
};

// 4. FEATURES PRESET (Header + Grid)
export const featureGridPreset: PresentationPreset = {
    key: 'related.feature.many.grid.v1',
    signature: { kind: 'related', target: 'feature', cardinality: 'many' },
    config: {
        ...DEFAULT_CONFIG,
        className: "bg-white",
        shape: 'group',
        children: [
            base({
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
            base({
                shape: 'list',
                listLayout: 'grid',
                listColumns: mkParam(2),
                listGap: mkParam(48), // gap-12
                listCount: mkParam(4),
                offsetY: mkParam(100),
                renderPolicy: { virtualization: 'none', overscanPx: 100 },
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
                }
            })
        ]
    }
};

// 5. SOLUTIONS PRESET (Header + Grid)
export const solutionGridPreset: PresentationPreset = {
    key: 'related.solution.many.grid.v1',
    signature: { kind: 'related', target: 'solution', cardinality: 'many' },
    config: {
        ...DEFAULT_CONFIG,
        className: "bg-neutral-50",
        shape: 'group',
        children: [
            base({
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
            base({
                shape: 'list',
                listLayout: 'grid',
                listColumns: mkParam(3),
                listGap: mkParam(32),
                offsetY: mkParam(100),
                renderPolicy: { virtualization: 'none', overscanPx: 100 },
                listTemplate: {
                    shape: 'card',
                    cardWidth: mkParam(350),
                    cardHeight: mkParam(350),
                    cardBackground: '#ffffff',
                    cardBorder: '1px solid rgba(0,0,0,0.05)',
                    cardRadius: '16px',
                    cardPadding: mkParam(32),
                    cardElevation: mkParam(1),
                    leadingPlacement: 'above',
                    leadingKind: 'icon',
                    leadingSize: mkParam(48),
                    leadingGap: mkParam(24),
                    tileAlign: 'left',
                    headingSize: mkParam(20),
                    headingColor: '#000000',
                    subSize: mkParam(16),
                    subColor: '#737373'
                }
            })
        ]
    }
};

// 6. CTA PRESET (Self)
export const ctaPreset: PresentationPreset = {
    key: 'self.cta.v1',
    signature: { kind: 'self' },
    config: {
        ...DEFAULT_CONFIG,
        className: "bg-black",
        shape: 'group',
        children: [
            base({
                shape: 'sphere',
                scale: mkParam(500),
                opacity: mkParam(0.3), glow: mkParam(2), bloom: mkParam(2),
                offsetX: mkParam(400), offsetY: mkParam(-400),
                animationType: 'rotate', colorFrequency: mkParam(0.5)
            }),
            base({
                shape: 'sphere',
                scale: mkParam(400),
                opacity: mkParam(0.2), glow: mkParam(1.5), bloom: mkParam(1),
                offsetX: mkParam(-400), offsetY: mkParam(400),
                hueShift: mkParam(3.14), animationType: 'rotate'
            }),
            base({
                shape: 'tile',
                tileAlign: 'center',
                tileLabel: '✨ Open for new collaborations',
                labelColor: 'rgba(255,255,255,0.8)', labelSize: mkParam(14),
                tileHeading: 'Ready to start?',
                headingSize: mkParam(80), headingColor: '#ffffff',
                tileSubtitle: "Let's build something extraordinary together. Reach out to discuss your next project.",
                subColor: 'rgba(255,255,255,0.6)', subSize: mkParam(20)
            }),
            base({
                shape: 'card',
                cardWidth: mkParam(200), cardHeight: mkParam(60),
                cardBackground: '#ffffff', cardRadius: '30px',
                offsetY: mkParam(200),
                tileHeading: 'Get in touch', headingColor: '#000000', headingSize: mkParam(18),
                tileAlign: 'center'
            })
        ]
    }
};

export const genericSectionPreset: PresentationPreset = {
    key: 'section.generic.v1',
    signature: { kind: 'self' },
    config: { ...DEFAULT_CONFIG }
};

export const PRESET_REGISTRY: PresetRegistry = {
    'self.hero.v1': heroPreset,
    'related.useCase.many.grid.v1': useCaseGridPreset,
    'related.product.many.marquee.v1': productMarqueePreset,
    'related.feature.many.grid.v1': featureGridPreset,
    'related.solution.many.grid.v1': solutionGridPreset,
    'self.cta.v1': ctaPreset,
    'section.generic.v1': genericSectionPreset,
};
