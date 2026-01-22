
import { PresetRegistry } from '../types';
import { PRESET_MANIFEST } from '../presets/manifest';
import { hashConfig } from './hashing';

export interface IntegrityIssue {
    key: string;
    expected: string;
    actual: string;
    status: 'missing_in_manifest' | 'mismatch';
}

export const checkPresetIntegrity = (registry: PresetRegistry): IntegrityIssue[] => {
    const issues: IntegrityIssue[] = [];

    // 1. Check Registry against Manifest (Consistency)
    Object.entries(registry).forEach(([key, preset]) => {
        const actualHash = hashConfig(preset.config);
        const expectedHash = PRESET_MANIFEST[key];

        if (!expectedHash) {
            // Strict mode: Track missing manifest entries to prompt developer to populate them
            issues.push({ key, expected: '', actual: actualHash, status: 'missing_in_manifest' });
        } else if (actualHash !== expectedHash) {
            issues.push({
                key,
                expected: expectedHash,
                actual: actualHash,
                status: 'mismatch'
            });
        }
    });

    return issues;
};

export const generateManifestLog = (registry: PresetRegistry) => {
    const map: Record<string, string> = {};
    Object.entries(registry).forEach(([key, preset]) => {
        map[key] = hashConfig(preset.config);
    });
    console.group("📋 Generated Preset Manifest");
    console.log(JSON.stringify(map, null, 4));
    console.groupEnd();
};
