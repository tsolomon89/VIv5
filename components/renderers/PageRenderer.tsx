
import React, { useMemo } from 'react';
import { PageTemplate, SectionInstance, SectionConfig } from '../../types';
import { SectionRenderer } from './SectionRenderer';

interface PageRendererProps {
    template: PageTemplate;
    sectionProgress: Record<string, number>;
    setSectionRef: (id: string, el: HTMLElement | null) => void;
    dataMap: Record<string, SectionConfig>;
}

export const PageRenderer: React.FC<PageRendererProps> = ({ template, sectionProgress, setSectionRef, dataMap }) => {
    
    // Sort Sections based on Placement Slot and Order
    const sortedSections = useMemo(() => {
        const startSections: SectionInstance[] = [];
        const endSections: SectionInstance[] = [];
        const freeSections: SectionInstance[] = [];

        template.sections.forEach(section => {
            if (section.placement.slot === 'start') {
                startSections.push(section);
            } else if (section.placement.slot === 'end') {
                endSections.push(section);
            } else {
                freeSections.push(section);
            }
        });

        // Sort free sections by order
        freeSections.sort((a, b) => (a.placement.order || 0) - (b.placement.order || 0));

        // Start -> Free -> End
        return [...startSections, ...freeSections, ...endSections];
    }, [template]);

    return (
        <>
            {sortedSections.map(section => (
                <SectionRenderer 
                    key={section.id}
                    section={section}
                    progress={sectionProgress[section.id] || 0} // Map 'hero-section' to progress
                    setRef={(el) => setSectionRef(section.id, el)} // This ID must match what App.tsx uses for tracking
                    dataMap={dataMap}
                />
            ))}
        </>
    );
};
