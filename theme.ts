export const THEME = {
    // Primary accent — used on buttons, active icons, highlights, badges
    accent: '#e43928',

    // App-level background (outermost dark layer)
    bg: '#000000',

    // Surface color — cards, modals, drawers, filter panels
    surface: '#111111',

    // Slightly lighter surface, used in gradients and nested surfaces
    surfaceAlt: '#1a1a1a',

    // Primary text color
    text: '#ffffff',

    // Muted / secondary text — labels, descriptions, placeholders
    muted: '#A0AEC0',
} as const;

export type Theme = typeof THEME;
