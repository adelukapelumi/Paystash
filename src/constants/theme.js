export const COLORS = {
    primary: '#0a192f',
    secondary: '#64ffda',
    accent: '#ffd700',
    bg: '#020c1b',
    bgCard: '#112240',
    text: '#e6f1ff',
    textMuted: '#8892b0',
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
};

export const FONTS = {
    sans: 'System', // Will update to Outfit/Inter once fonts are loaded
};

export const SIZES = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
};

export const RADIUS = {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
};

export const SHADOWS = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
    },
    neon: {
        shadowColor: '#64ffda',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
};

export const THEME = {
    COLORS,
    FONTS,
    SIZES,
    SPACING,
    RADIUS,
    SHADOWS,
};
