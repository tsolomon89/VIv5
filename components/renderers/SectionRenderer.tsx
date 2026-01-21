
import React, { useMemo } from 'react';
import { SectionInstance, ConfigState, SectionConfig } from '../../types';
import { PRESET_REGISTRY } from '../../presets/registry';
import { SectionChapter } from '../scene/SectionChapter';
import { validateSection } from '../../utils/validation';
import { ValidationNotice } from '../sections/ValidationNotice';
import { resolveSectionData } from '../../utils/resolution';

interface SectionRendererProps {
    section: SectionInstance;
    progress: number;
    setRef: (el: HTMLElement | null) => void;
    dataMap: Record<string, SectionConfig>;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, progress, setRef, dataMap }) => {
    // 1. Validation
    const errors = useMemo(() => validateSection(section, PRESET_REGISTRY), [section]);
    
    if (errors.length > 0) {
        return <ValidationNotice errors={errors} sectionId={section.id} />;
    }

    // 2. Preset Lookup & Cloning (No-bleed)
    const preset = PRESET_REGISTRY[section.presentationKey];
    // Deep clone config
    const baseConfig = JSON.parse(JSON.stringify(preset.config)) as ConfigState;

    // 3. Data Resolution (Binding) - Uses dynamic map
    const { objects, height, pinHeight } = resolveSectionData(section.id, section.binding, dataMap);

    // 4. Overrides Application (TODO: Merge logic)
    // For now, we assume objects come from data resolution and visual config from preset.
    // Overrides would patch baseConfig here.

    // 5. Render - Fully Generic
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
