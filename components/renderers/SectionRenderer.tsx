
import React, { useMemo } from 'react';
import { SectionInstance, ConfigState, SceneObject, Binding } from '../../types';
import { PRESET_REGISTRY } from '../../presets/registry';
import { SectionFrame } from '../scene/SectionFrame';
import { validateSection } from '../../utils/validation';
import { ValidationNotice } from '../sections/ValidationNotice';
import { resolveBindingData, resolveSectionDimensions } from '../../utils/resolution';
import { applyOverrides } from '../../utils/overrides';

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

    // 3. Apply Overrides (Phase C2)
    // We merge the preset config with the section overrides to get the effective config
    const effectiveConfig = applyOverrides(baseConfig, section.overrides || {});

    // 4. Object Synthesis
    // Create the root object from the effective config
    const rootObj: SceneObject = {
        ...effectiveConfig,
        id: `synth-${section.id}-root`,
        isExpanded: false
    };
    
    // Ensure ID for children if they were replaced/overridden
    if (rootObj.children) {
         rootObj.children = rootObj.children.map((c, i) => ({
             ...c,
             id: c.id || `child-${section.id}-${i}`
         }));
    }
    
    // 5. Data Injection (Phase D1)
    // Traverse the synthesized object tree and populate lists with binding data
    injectBindingData(rootObj, section.binding);

    const objects = [rootObj];
    
    // 6. Dimension Resolution
    // Use helper to resolve layout height/pinHeight (it respects overrides internally)
    const { height, pinHeight } = resolveSectionDimensions(section, PRESET_REGISTRY);

    // 7. Extract Config for Frame
    const clip = rootObj.clipWithinSection ?? true;

    // 8. Render via SectionFrame (Phase L1)
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
