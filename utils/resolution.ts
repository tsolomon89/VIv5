
import { Binding, SceneObject, SectionConfig, SectionInstance } from '../types';
import { projects } from '../data';

// Stub resolver to bridge the new data model with existing static data
export interface ResolvedData {
    objects: SceneObject[];
    height: number;
    pinHeight: number;
}

export const resolveBindingData = (binding: Binding): any[] => {
    if (binding.kind !== 'related') return [];

    if (binding.target === 'product' || binding.target === 'feature') {
        // Return projects mock
        return projects.map((p, i) => ({
            id: `item-${i}`,
            tileHeading: p.title,
            tileSubtitle: p.category,
            tileTrailing: p.year,
            textureUrl: p.image,
            cardMediaSrc: p.image
        }));
    }

    if (binding.target === 'useCase') {
        return [
            { tileHeading: 'Blob', leadingIcon: 'lucide:Circle' },
            { tileHeading: 'Yallo!', leadingIcon: 'lucide:Hexagon' },
            { tileHeading: 'Bliss+', leadingIcon: 'lucide:Square' },
            { tileHeading: 'Flea', leadingIcon: 'lucide:Triangle' }
        ];
    }

    if (binding.target === 'solution') {
        return [
            { 
                leadingIcon: 'lucide:Hexagon', 
                tileHeading: 'Brand Identity', 
                tileSubtitle: 'Crafting distinct visual languages that resonate with your audience and stand the test of time.'
            },
            { 
                leadingIcon: 'lucide:Square', 
                tileHeading: 'Digital Products', 
                tileSubtitle: 'Building robust, scalable web applications with cutting-edge technologies and seamless UX.'
            },
            { 
                leadingIcon: 'lucide:Triangle', 
                tileHeading: 'Motion Design', 
                tileSubtitle: 'Bringing static interfaces to life with fluid animations and interactive 3D experiences.'
            }
        ];
    }

    // Default mock for generic 'many'
    if (binding.cardinality === 'many') {
        return Array.from({ length: 6 }).map((_, i) => ({
            id: `gen-${i}`,
            tileHeading: `Item ${i + 1}`,
            tileSubtitle: 'Generated Content'
        }));
    }

    return [];
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

export const getLegacyKey = (sectionId: string): string => {
    if (sectionId.includes('hero')) return 'hero';
    if (sectionId.includes('use-cases')) return 'UseCases';
    if (sectionId.includes('products')) return 'Products';
    if (sectionId.includes('features')) return 'Features';
    if (sectionId.includes('solutions')) return 'Solutions';
    if (sectionId.includes('cta')) return 'CTA';
    return 'hero'; // Fallback
};
