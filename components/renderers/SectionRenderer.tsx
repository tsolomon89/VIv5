
import React, { useMemo } from 'react';
import { SectionInstance, ConfigState, SceneObject, Binding } from '../../types';
import { PRESET_REGISTRY } from '../../presets/registry';
import { SectionChapter } from '../scene/SectionChapter';
import { validateSection } from '../../utils/validation';
import { ValidationNotice } from '../sections/ValidationNotice';
import { resolveBindingData } from '../../utils/resolution';

interface SectionRendererProps {
    section: SectionInstance;
    progress: number;
    setRef: (el: HTMLElement | null) => void;
}

// Recursive helper to find List objects and inject resolved binding data
const injectBindingData = (obj: SceneObject, binding: Binding) => {
    // If this object is a list and fits the binding criteria (related), inject data
    if (obj.shape === 'list' && binding.kind === 'related') {
        const dataItems = resolveBindingData(binding);
        // Merge with existing items (e.g. from preset overrides or page template overrides)
        obj.listItems = [...(obj.listItems || []), ...dataItems];
        
        // Ensure list template exists
        if (!obj.listTemplate) {
            obj.listTemplate = { shape: 'card' };
        }
    }
    
    // Recurse children
    if (obj.children) {
        obj.children.forEach(child => injectBindingData(child, binding));
    }
};

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, progress, setRef }) => {
    // 1. Validation
    const errors = useMemo(() => validateSection(section, PRESET_REGISTRY), [section]);
    
    if (errors.length > 0) {
        return <ValidationNotice errors={errors} sectionId={section.id} />;
    }

    // 2. Preset Lookup & Cloning (No-bleed)
    const preset = PRESET_REGISTRY[section.presentationKey];
    // Deep clone config to serve as the root object template
    const baseConfig = JSON.parse(JSON.stringify(preset.config)) as ConfigState;

    // 3. Object Synthesis
    // Create the root object from the preset config
    const rootObj: SceneObject = {
        ...baseConfig,
        id: `synth-${section.id}-root`,
        isExpanded: false
    };

    // Apply Instance Overrides (e.g. from PageTemplate)
    if (section.overrides) {
        // We merge top-level overrides. 
        // For children/listItems, deep merging is complex, so we assume overrides might replace or append.
        // For v1 simplicity, Object.assign is used for top-level props.
        Object.assign(rootObj, section.overrides);
    }
    
    // 4. Data Injection
    // Traverse the synthesized object tree and populate lists with binding data
    injectBindingData(rootObj, section.binding);

    const objects = [rootObj];
    
    // 5. Dimension Resolution
    // In v1, we extract height/pinHeight from the root object params if they exist, 
    // or fallback to defaults. 
    // Note: ConfigState has 'height' as a NumberParam for Prism/Visuals.
    // For Section layout height, we look at the NumberParam value.
    const height = rootObj.height?.value && rootObj.height.value > 100 ? rootObj.height.value : 1000;
    // PinHeight isn't in ConfigState explicitly for layout (it was legacy SectionConfig).
    // We assume pinHeight is either standard or derived.
    const pinHeight = 800; 

    // 6. Render
    return (
        <SectionChapter
            id={section.id}
            height={height}
            pinHeight={pinHeight}
            objects={objects}
            progress={progress}
            setRef={setRef}
            className={
                section.id === 'use-cases-section' ? "bg-white rounded-t-3xl md:rounded-t-[4rem]" : 
                section.id === 'cta-section' ? "bg-black" : 
                section.id === 'solutions-section' ? "bg-neutral-50" : "bg-white"
            }
        />
    );
};
