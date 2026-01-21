import React from 'react';
import { SceneObject, NumberParam } from '../../types';
import { getIcon } from '../../utils/iconRegistry';

export const SceneTextRenderer = ({ objects, scrollProgress }: { objects: SceneObject[], scrollProgress: number }) => {
    // Helper to interpolate
    const getVal = (param: NumberParam) => {
        if (param.isLinked && param.endValue !== null) {
            return param.value + (param.endValue - param.value) * scrollProgress;
        }
        return param.value;
    };

    return (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" style={{ perspective: '1000px' }}>
            {objects.filter(o => o.shape === 'text').map(obj => {
                const x = getVal(obj.offsetX);
                const y = getVal(obj.offsetY);
                const z = getVal(obj.offsetZ);
                const scale = getVal(obj.scale) / 100; // Scale 100 = 1.0
                const opacity = getVal(obj.opacity);
                const blur = (1 - opacity) * 20;
                
                // Dynamic Heading Tag
                const Tag = (obj.textTag || 'h2') as any;
                const iconEntry = obj.leadingIcon ? getIcon(obj.leadingIcon) : null;
                const Icon = iconEntry ? iconEntry.render : null;

                return (
                    <div 
                        key={obj.id}
                        className="absolute top-1/2 left-1/2 w-[600px] -ml-[300px] -mt-[100px] flex flex-col justify-center"
                        style={{
                            transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`,
                            textAlign: obj.textAlign,
                            opacity: opacity,
                            filter: `blur(${blur}px)`
                        }}
                    >
                        {obj.textLabel && (
                            <div style={{
                                fontSize: `${getVal(obj.labelSize)}px`,
                                letterSpacing: `${getVal(obj.labelSpacing)}em`,
                                color: obj.labelColor
                            }} className="font-bold uppercase mb-4 font-mono transition-colors duration-200">
                                {obj.textLabel}
                            </div>
                        )}
                        {obj.textHeading && (
                            <div className={`flex items-center gap-4 ${obj.textAlign === 'center' ? 'justify-center' : obj.textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                                {Icon && <Icon className="mb-6" style={{ width: getVal(obj.headingSize), height: getVal(obj.headingSize), color: obj.headingColor }} />}
                                <Tag style={{
                                    fontSize: `${getVal(obj.headingSize)}px`,
                                    letterSpacing: `${getVal(obj.headingSpacing)}em`,
                                    lineHeight: getVal(obj.headingHeight),
                                    color: obj.headingColor
                                }} className="font-medium mb-6 transition-colors duration-200">
                                    {obj.textHeading}
                                </Tag>
                            </div>
                        )}
                        {obj.textSubtitle && (
                            <p style={{
                                fontSize: `${getVal(obj.subSize)}px`,
                                color: obj.subColor
                            }} className="font-light max-w-md mx-auto transition-colors duration-200">
                                {obj.textSubtitle}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};