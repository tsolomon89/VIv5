
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
    const baseConfig = JSON.parse(JSON.stringify(preset.config)) as ConfigState;

    // 3. Apply Overrides (Phase C2)
    const effectiveConfig = applyOverrides(baseConfig, section.overrides || {});

    // 4. Object Synthesis
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
    injectBindingData(rootObj, section.binding);

    const objects = [rootObj];
    
    // 6. Dimension Resolution
    const { height, pinHeight } = resolveSectionDimensions(section, PRESET_REGISTRY);

    // 7. Extract Config for Frame
    const clip = rootObj.clipWithinSection ?? true;
    const className = rootObj.className || "bg-white"; // Default background
    // Pass overscan from render policy if present, default 500
    const overscan = rootObj.renderPolicy?.overscanPx ?? 500;

    // 8. Render via SectionFrame (Phase L1)
    return (
        <SectionFrame
            id={section.id}
            height={height}
            pinHeight={pinHeight}
            objects={objects}
            setRef={setRef}
            clip={clip}
            className={className}
            overscanPx={overscan}
        />
    );
};
