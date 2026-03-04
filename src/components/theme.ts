// Design tokens matching stitch_education_categories asset

export const Colors = {
    primary: '#2beede',
    background: '#102220',
    backgroundCard: '#1a3330',
    surface: '#1e3d39',
    textPrimary: '#f1f5f9',    // slate-100
    textSecondary: '#94a3b8',  // slate-400
    textDisabled: '#475569',   // slate-600
    border: 'rgba(43,238,222,0.1)',
    error: '#f87171',
    white: '#ffffff',
} as const;

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

export const Radii = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,   // rounded-xl = 1.5rem
    full: 9999,
} as const;

export const Typography = {
    displayLarge: {
        fontFamily: 'Lexend_700Bold',
        fontSize: 30,
        lineHeight: 36,
        letterSpacing: -0.5,
    },
    titleLarge: {
        fontFamily: 'Lexend_700Bold',
        fontSize: 20,
        lineHeight: 28,
    },
    titleMedium: {
        fontFamily: 'Lexend_700Bold',
        fontSize: 17,
        lineHeight: 24,
    },
    titleSmall: {
        fontFamily: 'Lexend_700Bold',
        fontSize: 15,
        lineHeight: 20,
    },
    bodyLarge: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 17,
        lineHeight: 26,
    },
    bodyMedium: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 15,
        lineHeight: 22,
    },
    bodySmall: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 13,
        lineHeight: 19,
    },
    label: {
        fontFamily: 'Lexend_700Bold',
        fontSize: 10,
        lineHeight: 14,
        letterSpacing: 1,
        textTransform: 'uppercase' as const,
    },
} as const;
