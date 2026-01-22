
import React from 'react';
import { SectionScene } from './SectionScene';
import { SceneObject } from '../../types';

interface SectionFrameProps {
    id: string;
    height: number;
    pinHeight: number;
    objects: SceneObject[];
    progress: number;
    setRef: (el: HTMLElement | null) => void;
    children?: React.ReactNode;
    className?: string;
}

/**
 * SectionFrame (Phase L1)
 * Owns the structural contract for a section:
 * - Document flow height
 * - Sticky/Pinning behavior
 * - Local coordinate system
 * - Visibility culling wrapper (future)
 */
export const SectionFrame: React.FC<SectionFrameProps> = ({ 
    id, height, pinHeight, objects, progress, setRef, children, className = ""
}) => {
    // Clamp progress for rendering scene (safety against out-of-bounds inputs)
    const clampedProgress = Math.max(0, Math.min(1, progress));

    return (
        <div 
            ref={setRef} 
            id={id}
            style={{ height: `${height}px` }} 
            className={`relative w-full ${className}`}
        >
            <div 
                className="sticky top-0 w-full overflow-hidden" 
                style={{ height: `${pinHeight}px` }}
            >
                <div className="relative w-full h-full">
                    {/* Render Content */}
                    <div className="relative z-10 w-full h-full">
                        {children}
                    </div>
                    
                    {/* Render Scene Background */}
                    <div className="absolute inset-0 z-0">
                        <SectionScene objects={objects} progress={clampedProgress} />
                    </div>
                </div>
            </div>
        </div>
    );
};
