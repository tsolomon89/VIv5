
import { PageTemplate, PresetRegistry, SectionInstance, BindingSignature } from '../types';
import { matchesSignature } from './binding';

export interface ValidationError {
    sectionId: string;
    message: string;
    severity: 'error' | 'warning';
}

const VERSION_REGEX = /\.v\d+$/;

export const validateSection = (section: SectionInstance, registry: PresetRegistry): ValidationError[] => {
    const errors: ValidationError[] = [];
    const preset = registry[section.presentationKey];

    // 1. Check Preset Existence
    if (!preset) {
        errors.push({
            sectionId: section.id,
            message: `Presentation preset '${section.presentationKey}' not found in registry.`,
            severity: 'error'
        });
        return errors; // Cannot continue validation without preset
    }

    // 2. Check Signature Compatibility
    if (!matchesSignature(section.binding, preset.signature)) {
        errors.push({
            sectionId: section.id,
            message: `Binding incompatibility: Section binds to '${section.binding.kind}' but preset '${section.presentationKey}' expects '${preset.signature.kind}'.`,
            severity: 'error'
        });
    }

    // 3. Check Versioning Convention
    if (!VERSION_REGEX.test(section.presentationKey)) {
        errors.push({
            sectionId: section.id,
            message: `Presentation Key '${section.presentationKey}' does not follow the '.vN' versioning suffix convention.`,
            severity: 'warning'
        });
    }

    return errors;
};

export const validatePageTemplate = (template: PageTemplate, registry: PresetRegistry): ValidationError[] => {
    const errors: ValidationError[] = [];

    // 1. Check Context Invariant
    if (template.pageContext.kind === 'detail' && template.pageSubject.cardinality !== 'one') {
        errors.push({
            sectionId: 'PAGE_ROOT',
            message: `Page Context 'detail' requires Subject Cardinality 'one'. Got '${template.pageSubject.cardinality}'.`,
            severity: 'error'
        });
    }
    if (template.pageContext.kind === 'index' && template.pageSubject.cardinality !== 'many') {
        errors.push({
            sectionId: 'PAGE_ROOT',
            message: `Page Context 'index' requires Subject Cardinality 'many'. Got '${template.pageSubject.cardinality}'.`,
            severity: 'error'
        });
    }

    // 2. Check Sections
    template.sections.forEach(section => {
        errors.push(...validateSection(section, registry));
    });

    return errors;
};
