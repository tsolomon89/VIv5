
import React, { useMemo } from 'react';
import { SectionInstance, ConfigState, SceneObject, Binding } from '../../types';
import { PRESET_REGISTRY } from '../../presets/registry';
import { SectionFrame } from '../scene/SectionFrame';
import { validateSection } from '../../utils/validation';
import { ValidationNotice } from '../sections/ValidationNotice';
import { resolveBindingData, resolveSectionDimensions } from '../../utils/resolution';

interface SectionRendererProps {
    section: SectionInstance;
    setRef: (el: HTMLElement | null) => void;
}

// Recursive helper to find List objects and inject resolved binding data
const injectBindingData = (obj: SceneObject, binding: Binding) => {
    // If this object is a list and fits the binding criteria (related), inject data
    if (obj.shape === 'list' && binding.kind === 'related') {
        const dataItems = resolveBindingData(binding);
        // Merge with existing items. 
        // Note: In v1, we append binding data to existing override items to allow hybrids.
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

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, setRef }) => {
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

    // Apply Instance Overrides (Phase C2)
    if (section.overrides) {
        // Deep merge of top-level properties. 
        // For nested structures like children, a simple assign replaces the array.
        // This is consistent with v1 requirement: "overrides might replace or append".
        Object.assign(rootObj, section.overrides);
        
        // If overrides provided children, we need to ensure they have IDs
        if (section.overrides.children) {
             rootObj.children = section.overrides.children.map((c, i) => ({
                 ...c,
                 id: c.id || `override-child-${i}`
             }));
        }
    }
    
    // 4. Data Injection (Phase D1)
    // Traverse the synthesized object tree and populate lists with binding data
    injectBindingData(rootObj, section.binding);

    const objects = [rootObj];
    
    // 5. Dimension Resolution
    const { height, pinHeight } = resolveSectionDimensions(section, PRESET_REGISTRY);

    // 6. Extract Config for Frame
    // Respect the configuration for clipping (defaults to true in data.ts)
    const clip = rootObj.clipWithinSection ?? true;

    // 7. Render via SectionFrame (Phase L1)
    return (
        <SectionFrame
            id={section.id}
            height={height}
            pinHeight={pinHeight}
            objects={objects}
            setRef={setRef}
            clip={clip}
            className={
                // Legacy Background Handling (Temporary Migration Phase G2)
                section.id.includes('use-case') ? "bg-white rounded-t-3xl md:rounded-t-[4rem]" : 
                section.id.includes('cta') ? "bg-black" : 
                section.id.includes('solution') ? "bg-neutral-50" : "bg-white"
            }
        />
    );
};
