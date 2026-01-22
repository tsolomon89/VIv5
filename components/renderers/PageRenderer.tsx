
import React, { useMemo } from 'react';
import { PageTemplate, SectionInstance } from '../../types';
import { SectionRenderer } from './SectionRenderer';

interface PageRendererProps {
    template: PageTemplate;
    setSectionRef: (id: string, el: HTMLElement | null) => void;
}

export const PageRenderer: React.FC<PageRendererProps> = ({ template, setSectionRef }) => {
    
    // Sort Sections based on Placement Slot and Order
    // Enforce C1: At most one start and one end section
    const sortedSections = useMemo(() => {
        // Find FIRST start section
        const startSection = template.sections.find(s => s.placement.slot === 'start');
        
        // Find FIRST end section (or should it be last? usually one exists)
        const endSection = template.sections.find(s => s.placement.slot === 'end');
        
        // Collect all free sections and sort them
        const freeSections = template.sections
            .filter(s => s.placement.slot === 'free')
            .sort((a, b) => (a.placement.order || 0) - (b.placement.order || 0));

        const result: SectionInstance[] = [];
        if (startSection) result.push(startSection);
        result.push(...freeSections);
        if (endSection) result.push(endSection);
        
        return result;
    }, [template]);

    return (
        <>
            {sortedSections.map(section => (
                <SectionRenderer 
                    key={section.id}
                    section={section}
                    setRef={(el) => setSectionRef(section.id, el)}
                />
            ))}
        </>
    );
};
