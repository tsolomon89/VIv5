
import { Binding, SceneObject, SectionConfig, SectionInstance } from '../types';
import { INITIAL_SECTIONS } from '../data';

// Stub resolver to bridge the new data model with existing static data
export interface ResolvedData {
    objects: SceneObject[];
    height: number;
    pinHeight: number;
}

// Map known IDs from INITIAL_PAGE_TEMPLATE to INITIAL_SECTIONS keys
export const getLegacyKey = (sectionId: string): string => {
    if (sectionId === 'hero-section') return 'hero';
    if (sectionId === 'use-cases-section') return 'UseCases';
    if (sectionId === 'products-section') return 'Products';
    if (sectionId === 'features-section') return 'Features';
    if (sectionId === 'solutions-section') return 'Solutions';
    if (sectionId === 'cta-section') return 'CTA';
    return sectionId;
};

export const resolveSectionData = (
    sectionId: string, 
    binding: Binding, 
    dataSource: Record<string, SectionConfig> = INITIAL_SECTIONS
): ResolvedData => {
    
    const legacyKey = getLegacyKey(sectionId);
    const legacyData = dataSource[legacyKey];

    if (legacyData) {
        return {
            objects: legacyData.objects,
            height: legacyData.height,
            pinHeight: legacyData.pinHeight
        };
    }

    // Default Fallback
    return {
        objects: [],
        height: 1000,
        pinHeight: 800
    };
};

export const getSectionLabel = (section: SectionInstance): string => {
    const bindingLabel = section.binding.kind === 'self' 
        ? 'Self' 
        : `Related (${section.binding.target})`;
        
    const slotLabel = section.placement.slot === 'start' 
        ? 'Hero' 
        : section.placement.slot === 'end' 
            ? 'CTA' 
            : 'Section';

    return `${slotLabel} • ${bindingLabel}`;
};
