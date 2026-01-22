
// Deterministic JSON stringify (handles key sorting)
export const stableStringify = (obj: any): string => {
    // Handle primitives
    if (typeof obj !== 'object' || obj === null) {
        return JSON.stringify(obj);
    }

    // Handle Arrays
    if (Array.isArray(obj)) {
        return '[' + obj.map(stableStringify).join(',') + ']';
    }

    // Handle Objects (Sort keys)
    return '{' + Object.keys(obj).sort().map(k => 
        JSON.stringify(k) + ':' + stableStringify(obj[k])
    ).join(',') + '}';
};

// Simple DJB2-like string hash
export const computeHash = (str: string): string => {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return (hash >>> 0).toString(16); // Force unsigned 32-bit hex
};

export const hashConfig = (config: any): string => {
    // We ignore 'id' fields usually generated randomly at runtime if they exist in presets
    // But our presets define IDs or use helpers. Ideally presets are static.
    // We'll strip IDs for safety if they look like random strings, but for now strict hashing.
    const json = stableStringify(config);
    return computeHash(json);
};
