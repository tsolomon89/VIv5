import { useState } from 'react';
import { ConfigState, SceneObject, SectionConfig, ShapeType } from '../types';
import { DEFAULT_CONFIG, mkParam, INITIAL_SECTIONS, createObj } from '../data';

export const useSceneManager = () => {
    const [sections, setSections] = useState<Record<string, SectionConfig>>(INITIAL_SECTIONS);
    const [singleConfig, setSingleConfig] = useState<ConfigState>(JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
    const [activeSectionId, setActiveSectionId] = useState<string>('hero');

    const updateSingleConfig = (key: keyof ConfigState, value: any) => {
        setSingleConfig(prev => ({ ...prev, [key]: value }));
    };

    const addSceneObject = (shape: ShapeType) => {
        const newObj = createObj({ shape, isExpanded: true, hueShift: mkParam(Math.random() * 6.28) });
        setSections(prev => ({
            ...prev,
            [activeSectionId]: { ...prev[activeSectionId], objects: [newObj, ...prev[activeSectionId].objects] }
        }));
    };

    const duplicateSceneObject = (objId: string) => {
        setSections(prev => {
            const sec = prev[activeSectionId];
            const index = sec.objects.findIndex(o => o.id === objId);
            if (index === -1) return prev;

            const original = sec.objects[index];
            const copy: SceneObject = { ...JSON.parse(JSON.stringify(original)), id: Math.random().toString(36).substr(2, 9), isExpanded: true };
            const newObjs = [...sec.objects];
            newObjs.splice(index + 1, 0, copy);
            return { ...prev, [activeSectionId]: { ...sec, objects: newObjs } };
        });
    };

    const removeSceneObject = (objId: string) => {
        setSections(prev => ({
            ...prev,
            [activeSectionId]: { ...prev[activeSectionId], objects: prev[activeSectionId].objects.filter(o => o.id !== objId) }
        }));
    };

    const updateSceneObject = (objId: string, key: keyof ConfigState, value: any) => {
        setSections(prev => ({
            ...prev,
            [activeSectionId]: {
                ...prev[activeSectionId],
                objects: prev[activeSectionId].objects.map(o => o.id === objId ? { ...o, [key]: value } : o)
            }
        }));
    };

    const updateSectionHeight = (h: number) => {
        setSections(prev => {
            const currentPin = prev[activeSectionId].pinHeight;
            const newHeight = Math.max(h, currentPin); // Prevent height < pinHeight
            return {
                ...prev,
                [activeSectionId]: { ...prev[activeSectionId], height: newHeight }
            };
        });
    };

    const updateSectionPinHeight = (h: number) => {
        setSections(prev => {
            const currentHeight = prev[activeSectionId].height;
            const newPin = Math.min(h, currentHeight); // Prevent pinHeight > height
            return {
                ...prev,
                [activeSectionId]: { ...prev[activeSectionId], pinHeight: newPin }
            };
        });
    };

    const toggleSceneObject = (objId: string) => {
        setSections(prev => ({
            ...prev,
            [activeSectionId]: {
                ...prev[activeSectionId],
                objects: prev[activeSectionId].objects.map(o => o.id === objId ? { ...o, isExpanded: !o.isExpanded } : o)
            }
        }));
    };

    return {
        sections,
        setSections,
        singleConfig,
        updateSingleConfig,
        activeSectionId,
        setActiveSectionId,
        addSceneObject,
        duplicateSceneObject,
        removeSceneObject,
        updateSceneObject,
        updateSectionHeight,
        updateSectionPinHeight,
        toggleSceneObject,
        activeObjects: sections[activeSectionId]?.objects || []
    };
};