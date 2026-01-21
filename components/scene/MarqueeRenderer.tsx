import React, { useEffect, useRef, useMemo } from 'react';
import { Renderer, Program, Mesh, Texture, Geometry, Color } from 'ogl';
import { SceneObject, NumberParam } from '../../types';
import { trackContext, trackRaf } from '../../utils/performance';

// --- Shader Definitions ---

const vertexMesh = /* glsl */ `
    attribute vec2 position;
    attribute vec2 uv;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.0, 1.0);
    }
`;

const fragmentMesh = /* glsl */ `
    precision highp float;
    uniform sampler2D uTexture;
    
    // Radii: vec4(BottomRight, TopRight, BottomLeft, TopLeft)
    uniform vec4 uRadii; 
    uniform vec2 uDimensions;
    uniform float uOpacity;
    uniform float uImgAspect;
    uniform float uGrayscale; // 0.0 = color, 1.0 = gray
    uniform float uBorderWidth;
    uniform vec3 uBorderColor;
    
    varying vec2 vUv;
    
    // SDF for Box with varying corner radii
    float sdRoundedBox(in vec2 p, in vec2 b, in vec4 r) {
        vec2 selectedX = (p.x > 0.0) ? r.xy : r.zw;
        float rFinal = (p.y > 0.0) ? selectedX.x : selectedX.y;
        vec2 q = abs(p) - b + rFinal;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - rFinal;
    }

    void main() {
        vec2 p = (vUv - 0.5) * uDimensions;
        vec2 halfDim = uDimensions * 0.5;
        
        float d = sdRoundedBox(p, halfDim, uRadii);
        
        // Anti-aliased edge
        float alpha = 1.0 - smoothstep(-1.0, 0.0, d);
        if (alpha <= 0.0) discard;
        
        // Border Logic (Inner Stroke)
        // d is negative inside. Border zone is d > -uBorderWidth
        float borderAlpha = 0.0;
        if (uBorderWidth > 0.0) {
            borderAlpha = smoothstep(-uBorderWidth - 1.0, -uBorderWidth, d);
        }
        
        // Cover Logic
        float planeAspect = uDimensions.x / uDimensions.y;
        float imgAspect = uImgAspect;
        if (imgAspect == 0.0) imgAspect = 1.0;
        
        vec2 ratio = vec2(1.0);
        if (planeAspect > imgAspect) {
            ratio.y = planeAspect / imgAspect;
        } else {
            ratio.x = imgAspect / planeAspect;
        }
        
        vec2 uv = (vUv - 0.5) * ratio + 0.5;
        vec4 tex = texture2D(uTexture, vec2(uv.x, 1.0 - uv.y)); 
        
        float grayVal = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
        vec3 finalColor = mix(tex.rgb, vec3(grayVal), uGrayscale);
        
        // Mix Border
        finalColor = mix(finalColor, uBorderColor, borderAlpha);
        
        gl_FragColor = vec4(finalColor, tex.a * alpha * uOpacity);
    }
`;

// Helper: Parse "TL TR BR BL" or "All" string to [BR, TR, BL, TL] for shader
// Note: CSS order is Top-Left, Top-Right, Bottom-Right, Bottom-Left
// Shader sdRoundedBox expects specific quadrant mapping.
// CSS Input: TL, TR, BR, BL
// Output map: [TR, BR, TL, BL]
const parseRadius = (str: string): [number, number, number, number] => {
    if (!str) return [0,0,0,0];
    const parts = str.replace(/px/g, '').split(' ').map(parseFloat).filter(n => !isNaN(n));
    
    if (parts.length === 1) {
        const r = parts[0];
        return [r, r, r, r]; 
    }
    if (parts.length === 4) {
        // CSS: TL(0), TR(1), BR(2), BL(3)
        // Shader Expects: TR, BR, TL, BL
        return [parts[1], parts[2], parts[0], parts[3]];
    }
    return [0,0,0,0];
};

// Helper: Get value
const getVal = (param: NumberParam | undefined, progress: number, def: number = 0) => {
    if (!param) return def;
    if (param.isLinked && param.endValue !== null) {
        return param.value + (param.endValue - param.value) * progress;
    }
    return param.value;
};

interface MarqueeRendererProps {
    listObject: SceneObject;
    scrollProgress: number;
}

export const MarqueeRenderer: React.FC<MarqueeRendererProps> = ({ listObject, scrollProgress }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: -1, y: -1, active: false });
    const colorHelper = useRef(new Color()); // Reusable color object to avoid GC
    const itemStateRef = useRef<Map<string, { scale: number, grayscale: number }>>(new Map());
    
    // Stable ref for scrollProgress to avoid re-initializing WebGL on scroll
    const progressRef = useRef(scrollProgress);
    useEffect(() => { progressRef.current = scrollProgress; }, [scrollProgress]);

    // Prepare Items
    const template = listObject.listTemplate || {};
    const items = listObject.listItems || [];
    
    // Radius Pattern Logic
    const radiusPatterns = useMemo(() => 
        listObject.listRadiusPattern 
            ? listObject.listRadiusPattern.split('|').map(s => s.trim()) 
            : [],
    [listObject.listRadiusPattern]);

    // Memoize flattened items to avoid recreation on every render frame
    const flattenedItems = useMemo(() => {
        return items.map((item, i) => {
            // Determine radius: Item Override > Pattern > Template
            let r = item.cardRadius || template.cardRadius || '0px';
            if (radiusPatterns.length > 0) {
                r = radiusPatterns[i % radiusPatterns.length];
            }

            return {
                ...template,
                ...item,
                cardRadius: r,
                id: item.id || `marquee-item-${i}`
            };
        });
    }, [items, template, radiusPatterns]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || flattenedItems.length === 0) return;

        // --- Setup OGL ---
        trackContext(1);
        const dpr = Math.min(1.5, window.devicePixelRatio || 1);
        
        const renderer = new Renderer({ 
            dpr, 
            alpha: true, 
            antialias: false, 
            depth: false,
            autoClear: false 
        });
        
        const gl = renderer.gl;
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        Object.assign(gl.canvas.style, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10 // Match DOM z-index
        });
        
        container.appendChild(gl.canvas);

        // --- Resources ---
        const itemTextures = flattenedItems.map(obj => {
            const t = new Texture(gl, {
                wrapS: gl.CLAMP_TO_EDGE,
                wrapT: gl.CLAMP_TO_EDGE,
                minFilter: gl.LINEAR,
                magFilter: gl.LINEAR,
                flipY: false
            });
            
            t.image = new Uint8Array([200, 200, 200, 255]); // Placeholder
            t.width = 1;
            t.height = 1;
            t.needsUpdate = true;
            
            if (obj.textureUrl) {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = obj.textureUrl;
                img.onload = () => {
                    t.image = img;
                    t.width = img.width;
                    t.height = img.height;
                    t.needsUpdate = true;
                };
            }
            return { id: obj.id, texture: t, aspect: 1, radius: parseRadius(obj.cardRadius) };
        });

        const geometry = new Geometry(gl, {
            position: { size: 2, data: new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]) },
            uv: { size: 2, data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]) },
            index: { data: new Uint16Array([0, 1, 2, 2, 1, 3]) }
        });

        const program = new Program(gl, {
            vertex: vertexMesh,
            fragment: fragmentMesh,
            uniforms: {
                uTexture: { value: null },
                uDimensions: { value: new Float32Array([100, 100]) },
                uRadii: { value: new Float32Array([0,0,0,0]) },
                uOpacity: { value: 1.0 },
                uImgAspect: { value: 1.0 },
                uGrayscale: { value: 0.0 },
                uBorderWidth: { value: 0.0 },
                uBorderColor: { value: new Color(1,1,1) },
                modelViewMatrix: { value: new Float32Array(16) },
                projectionMatrix: { value: new Float32Array(16) }
            },
            cullFace: false,
            transparent: true
        });

        const mesh = new Mesh(gl, { geometry, program });

        // --- State ---
        let rafId = 0;
        let scrollOffset = 0;
        let isVisible = false;
        let isPaused = false;
        let lastTime = performance.now();

        // --- Layout Params State ---
        let width = 0;
        let height = 0;
        let itemW = 0;
        let itemH = 0;
        let totalItemWidth = 0;
        let speed = 1;
        let direction = 1;
        let gap = 32;

        const updateLayout = () => {
            if (!container) return;
            width = container.clientWidth;
            height = container.clientHeight;
            renderer.setSize(width, height);
            
            const currentP = progressRef.current;
            
            itemW = getVal(template.cardWidth, currentP, 400);
            itemH = getVal(template.cardHeight, currentP, 560);
            gap = getVal(listObject.listGap, currentP, 32);

            // Responsive check
            if (width < 768) {
                itemW = 280;
                itemH = 400;
            }

            totalItemWidth = itemW + gap;
            
            const projection = new Float32Array([
                2/width, 0, 0, 0,
                0, -2/height, 0, 0,  
                0, 0, -1, 0,
                -1, 1, 0, 1     
            ]);
            program.uniforms.projectionMatrix.value = projection;
        };
        
        // --- Interaction ---
        const onMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
            mouseRef.current.active = true;
        };

        const onLeave = () => {
            mouseRef.current.active = false;
        };

        // Attach listeners
        container.addEventListener('mousemove', onMove);
        container.addEventListener('mouseleave', onLeave);
        container.addEventListener('mouseenter', onMove);

        // --- Render Loop ---
        const render = (t: number) => {
            rafId = requestAnimationFrame(render);
            if (!isVisible) return; 

            const dt = (t - lastTime) * 0.001;
            lastTime = t;
            
            const currentP = progressRef.current;
            
            // Read latest config
            speed = getVal(listObject.listSpeed, currentP, 1);
            direction = getVal(listObject.listDirection, currentP, 1);
            const globalOffsetY = getVal(listObject.offsetY, currentP, 0);
            const globalOffsetX = getVal(listObject.offsetX, currentP, 0);
            
            const pauseOnHover = listObject.marqueeHoverPause ?? true;
            
            // Interaction Params
            const hoverScale = getVal(listObject.itemHoverScale, currentP, 1.05);
            const baseGrayscale = getVal(listObject.itemBaseGrayscale, currentP, 0.0);
            const hoverGrayscale = getVal(listObject.itemHoverGrayscale, currentP, 0.0);
            const transitionSpeed = getVal(listObject.listSmoothness, currentP, 0.1);
            
            // Border Props
            const bWidth = getVal(template.cardBorderWidth, currentP, 0);
            const bColorHex = template.cardBorderColor || '#ffffff';
            
            // Update shared uniforms
            colorHelper.current.set(bColorHex);
            program.uniforms.uBorderColor.value = colorHelper.current;
            program.uniforms.uBorderWidth.value = bWidth;
            program.uniforms.uDimensions.value[0] = itemW;
            program.uniforms.uDimensions.value[1] = itemH;

            // Hover Pause Logic
            const centerY = (height / 2) + globalOffsetY;
            let isHoveringContainer = false;
            if (mouseRef.current.active) {
                const mx = mouseRef.current.x;
                const my = mouseRef.current.y;
                if (my >= centerY - itemH/2 && my <= centerY + itemH/2) {
                    isHoveringContainer = true;
                }
            }
            
            if (pauseOnHover && isHoveringContainer) {
                isPaused = true;
            } else {
                isPaused = false;
            }

            if (!isPaused) {
                scrollOffset += (speed * 60) * dt * direction;
            }

            gl.clearColor(0,0,0,0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            const totalLoopWidth = flattenedItems.length * totalItemWidth;
            // Handle negative scrolling loop
            const effectiveScroll = ((scrollOffset % totalLoopWidth) + totalLoopWidth) % totalLoopWidth;
            
            let currentX = -effectiveScroll + globalOffsetX;
            
            let count = 0;
            const maxCount = 50; 

            // Single Track Loop
            while (currentX < width + itemW && count < maxCount) {
                flattenedItems.forEach((obj, i) => {
                    const drawX = currentX + (i * totalItemWidth);
                    
                    if (drawX > -itemW && drawX < width) {
                        const texData = itemTextures[i];
                        const img = texData.texture.image as HTMLImageElement;
                        if (img && typeof img.width === 'number' && img.width > 1) {
                            texData.aspect = img.width / img.height;
                        }
                        
                        // Per-item uniform updates
                        program.uniforms.uTexture.value = texData.texture;
                        program.uniforms.uImgAspect.value = texData.aspect;
                        program.uniforms.uRadii.value.set(texData.radius);

                        // Hover Logic
                        let isItemHovered = false;
                        if (mouseRef.current.active) {
                            const mx = mouseRef.current.x;
                            const my = mouseRef.current.y;
                            if (mx >= drawX && mx <= drawX + itemW &&
                                my >= (centerY - itemH/2) && my <= (centerY + itemH/2)) {
                                isItemHovered = true;
                            }
                        }
                        
                        // State Transition
                        const targetScale = isItemHovered ? hoverScale : 1.0;
                        const targetGrayscale = isItemHovered ? hoverGrayscale : baseGrayscale;
                        
                        let state = itemStateRef.current.get(obj.id);
                        if (!state) {
                            state = { scale: 1.0, grayscale: baseGrayscale };
                            itemStateRef.current.set(obj.id, state);
                        }
                        
                        state.scale += (targetScale - state.scale) * transitionSpeed;
                        state.grayscale += (targetGrayscale - state.grayscale) * transitionSpeed;
                        
                        if(Math.abs(targetScale - state.scale) < 0.001) state.scale = targetScale;
                        if(Math.abs(targetGrayscale - state.grayscale) < 0.001) state.grayscale = targetGrayscale;

                        program.uniforms.uGrayscale.value = state.grayscale;
                        
                        const finalW = itemW * state.scale;
                        const finalH = itemH * state.scale;
                        const posX = drawX + itemW/2;
                        
                        const mv = program.uniforms.modelViewMatrix.value;
                        mv[0] = finalW; mv[5] = finalH; mv[10] = 1; mv[15] = 1;
                        mv[12] = posX; mv[13] = centerY; 
                        
                        renderer.render({ scene: mesh });
                    }
                });
                currentX += totalLoopWidth;
                count++;
            }
        };

        const observer = new IntersectionObserver((entries) => {
             const wasVisible = isVisible;
             isVisible = entries[0].isIntersecting;
             if (!wasVisible && isVisible) {
                 lastTime = performance.now();
                 cancelAnimationFrame(rafId);
                 rafId = requestAnimationFrame(render);
                 trackRaf(1);
             } else if (!isVisible) {
                 trackRaf(-1);
             }
        }, { rootMargin: '50% 0px 50% 0px' }); 
        
        observer.observe(container);
        window.addEventListener('resize', updateLayout);
        updateLayout();
        
        rafId = requestAnimationFrame(render);
        trackRaf(1);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', updateLayout);
            observer.disconnect();
            
            container.removeEventListener('mousemove', onMove);
            container.removeEventListener('mouseleave', onLeave);
            container.removeEventListener('mouseenter', onMove);
            
            if (gl.canvas.parentNode) gl.canvas.remove();
            trackContext(-1);
            trackRaf(-1);
        };
    }, [listObject.id, flattenedItems]); 

    return <div ref={containerRef} className="w-full h-full relative pointer-events-auto" />;
};
