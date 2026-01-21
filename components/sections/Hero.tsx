import React from 'react';
import { SectionScene } from '../scene/SectionScene';
import { SceneObject } from '../../types';

interface HeroProps {
  height: number;
  objects: SceneObject[];
  progress: number;
}

export const Hero: React.FC<HeroProps> = ({ height, objects, progress }) => {
  return (
    <div style={{ height: `${height}px` }} className="w-full relative z-0">
        <div className="fixed inset-0 z-0">
            <SectionScene objects={objects} progress={progress} />
        </div>
    </div>
  );
};