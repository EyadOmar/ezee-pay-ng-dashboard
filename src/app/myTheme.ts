import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyTheme = definePreset(Aura, {
  primitive: {
    green: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
      950: '#022C22',
    },
    amber: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      950: '#451A03',
    },
    red: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
      950: '#450A0A',
    },
    // Added Slate for specific dark mode input shades
    slate: {
      800: '#1F2937', // The specific input BG you wanted
      700: '#374151', // The specific input Border you wanted
    },
  },
  semantic: {
    primary: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
      950: '#1E1B4B',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#4F46E5',
          contrastColor: '#ffffff',
          hoverColor: '#4338CA',
          activeColor: '#3730A3',
        },
        surface: {
          0: '#FFFFFF', // Card Background (Pure White)
          50: '#F9FAFB', // App Background (Lightest Grey)
          100: '#F3F4F6',
          200: '#E5E7EB', // Borders (Subtle)
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280', // Subtext
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937', // Main Text
          900: '#111827',
          950: '#030712',
        },
      },
      dark: {
        primary: {
          color: '#6366F1',
          contrastColor: '#ffffff',
          hoverColor: '#818CF8',
          activeColor: '#A5B4FC',
        },
        surface: {
          0: '#0F1115', // App Background (Deep Charcoal)
          50: '#18181B', // Card Background (Slightly Lighter)
          100: '#1F1F23',
          200: '#27272A', // Borders (Subtle Dark)
          300: '#3F3F46',
          400: '#52525B',
          500: '#71717A',
          600: '#A1A1AA', // Subtext
          700: '#D4D4D8',
          800: '#E4E4E7',
          900: '#F4F4F5', // Main Text (Off-White)
          950: '#FAFAFA',
        },
        formField: {
          background: '{slate.800}',
          borderColor: '{slate.700}',
          color: '{surface.900}',
          hoverBorderColor: '{primary.color}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.500}',
        },
      },
    },
  },
});

export default MyTheme;
