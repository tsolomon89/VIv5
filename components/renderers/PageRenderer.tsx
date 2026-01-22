
import React, { useMemo } from 'react';
import { PageTemplate, SectionInstance } from '../../types';
import { SectionRenderer } from './SectionRenderer';

interface PageRendererProps {
    template: PageTemplate;
    setSectionRef: (id: string, el: HTMLElement | null) => void;
}

export const PageRenderer: React.FC<PageRendererProps> = ({ template, setSectionRef }) => {
    
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
                    setRef={(el) => setSectionRef(section.id, el)}
                />
            ))}
        </>
    );
};
