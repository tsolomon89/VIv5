
import { PresentationPreset, PresetRegistry } from '../types';
import { DEFAULT_CONFIG } from '../data';

// 1. Self / Hero Presets
export const heroPreset: PresentationPreset = {
    key: 'self.hero.v1',
    signature: { kind: 'self' },
    config: {
        ...DEFAULT_CONFIG,
        // Hero specifics if needed
    }
};

export const genericSectionPreset: PresentationPreset = {
    key: 'section.generic.v1',
    signature: { kind: 'self' },
    config: { ...DEFAULT_CONFIG }
};

export const ctaPreset: PresentationPreset = {
    key: 'self.cta.v1',
    signature: { kind: 'self' },
    config: {
        ...DEFAULT_CONFIG,
        // CTA defaults (e.g. black background implied by overrides usually, but can be set here)
    }
};

// 2. Related Product Presets
export const productMarqueePreset: PresentationPreset = {
    key: 'related.product.many.marquee.v1',
    signature: { kind: 'related', target: 'product', cardinality: 'many' },
    config: {
        ...DEFAULT_CONFIG,
        shape: 'list',
        listLayout: 'marquee',
        listGap: { value: 32, endValue: null, isLinked: false },
        listSpeed: { value: 1.5, endValue: null, isLinked: false }
    }
};

export const productGridPreset: PresentationPreset = {
    key: 'related.product.many.grid.v1',
    signature: { kind: 'related', target: 'product', cardinality: 'many' },
    config: {
        ...DEFAULT_CONFIG,
        shape: 'list',
        listLayout: 'grid',
        listColumns: { value: 3, endValue: null, isLinked: false },
        listGap: { value: 40, endValue: null, isLinked: false }
    }
};

// 3. Related UseCase Presets
export const useCaseStackPreset: PresentationPreset = {
    key: 'related.useCase.many.stack.v1',
    signature: { kind: 'related', target: 'useCase', cardinality: 'many' },
    config: {
        ...DEFAULT_CONFIG,
        shape: 'list',
        listLayout: 'stack',
        listGap: { value: 24, endValue: null, isLinked: false }
    }
};

export const PRESET_REGISTRY: PresetRegistry = {
    'self.hero.v1': heroPreset,
    'section.generic.v1': genericSectionPreset,
    'self.cta.v1': ctaPreset,
    'related.product.many.marquee.v1': productMarqueePreset,
    'related.product.many.grid.v1': productGridPreset,
    'related.useCase.many.stack.v1': useCaseStackPreset,
};
