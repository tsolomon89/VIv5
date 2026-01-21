
import { useState, useEffect } from 'react';
import { PageTemplate, SectionInstance, Binding, Placement } from '../types';
import { INITIAL_PAGE_TEMPLATE, TEMPLATES } from '../data';
import { validatePageTemplate } from '../utils/validation';
import { PRESET_REGISTRY } from '../presets/registry';

const STORAGE_KEY = 'vi_page_template_v1';

export const useTemplateManager = () => {
    // Initialize from LocalStorage or Fallback
    const [template, setTemplate] = useState<PageTemplate>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Basic check - in a real app use schema validation (Zod)
                if (parsed && Array.isArray(parsed.sections)) {
                    console.log("Loaded template from storage.");
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Failed to load template from storage:", e);
        }
        return INITIAL_PAGE_TEMPLATE;
    });

    // Persistence Effect
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(template));
        } catch (e) {
            console.error("Failed to save template:", e);
        }
    }, [template]);

    const updateSection = (sectionId: string, updates: Partial<SectionInstance>) => {
        setTemplate(prev => ({
            ...prev,
            sections: prev.sections.map(s => 
                s.id === sectionId ? { ...s, ...updates } : s
            )
        }));
    };

    const updateSectionBinding = (sectionId: string, binding: Binding) => {
        updateSection(sectionId, { binding });
    };

    const updateSectionPlacement = (sectionId: string, placement: Placement) => {
        updateSection(sectionId, { placement });
    };

    const updateSectionPresentation = (sectionId: string, presentationKey: string) => {
        updateSection(sectionId, { presentationKey });
    };

    const addSection = () => {
        const newId = `section-${Date.now()}`;
        const newSection: SectionInstance = {
            schemaVersion: 1,
            id: newId,
            placement: { slot: 'free', order: 99 }, // Add to end of free pool
            binding: { kind: 'self' },
            presentationKey: 'section.generic.v1',
            overrides: {}
        };
        
        setTemplate(prev => ({
            ...prev,
            sections: [...prev.sections, newSection]
        }));
        
        return newId;
    };

    const removeSection = (sectionId: string) => {
        if (window.confirm("Are you sure you want to remove this section?")) {
            setTemplate(prev => ({
                ...prev,
                sections: prev.sections.filter(s => s.id !== sectionId)
            }));
        }
    };

    const importTemplate = (jsonString: string): { success: boolean; error?: string } => {
        try {
            const parsed = JSON.parse(jsonString) as PageTemplate;
            // Validate before applying
            const errors = validatePageTemplate(parsed, PRESET_REGISTRY);
            
            if (errors.length > 0) {
                console.error("Import Validation Errors:", errors);
                return { success: false, error: `Validation failed: ${errors[0].message}` };
            }

            setTemplate(parsed);
            return { success: true };
        } catch (e) {
            return { success: false, error: "Invalid JSON format" };
        }
    };

    const loadTemplate = (templateId: string) => {
        const t = TEMPLATES[templateId];
        if (t) {
            if(window.confirm(`Switch to template '${t.name}'? Unsaved changes will be lost.`)) {
                setTemplate(t);
            }
        }
    };

    const resetTemplate = () => {
        if(window.confirm("Reset to default template? This cannot be undone.")) {
            setTemplate(INITIAL_PAGE_TEMPLATE);
        }
    };

    return {
        template,
        setTemplate,
        updateSection,
        updateSectionBinding,
        updateSectionPlacement,
        updateSectionPresentation,
        addSection,
        removeSection,
        importTemplate,
        loadTemplate,
        resetTemplate
    };
};
