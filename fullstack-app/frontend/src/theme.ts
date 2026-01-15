import { createSystem, defaultConfig } from '@chakra-ui/react';

const customConfig = {
  theme: {
    tokens: {
      colors: {
        canvas: { value: '#f8f5f1ff' },
        ink: { value: 'gray.900' },
        primary: { value: '#161717ff' },
        accent: { value: 'orange.200' },
      },
      fonts: {
        body: { value: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif' },
        heading: { value: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif' },
      },
      radii: {
        subtle: { value: '12px' },
      },
      fontSizes: {
        h1: { value: "3rem" },     // 48px
        h2: { value: "2.25rem" },  // 36px
        h3: { value: "1.875rem" }, // 30px
      },
    },
  },
  globalCss: {
    'html, body': {
      bg: '{colors.canvas}',
      color: '{colors.ink}',
      fontFamily: '{fonts.body}',
      minHeight: '100%',
    },
    body: {
      lineHeight: 1.5,
    },
    a: {
      color: '{colors.accent}',
    },
    "h1": {
      fontSize: "{fontSizes.h1}",
      fontFamily: "{fonts.heading}",
      fontWeight: "bold",
    },
    "h2": {
      fontSize: "{fontSizes.h2}",
      fontFamily: "{fonts.heading}",
      fontWeight: "semibold",
    },
  },
};

export const system = createSystem(defaultConfig, customConfig);

export const pageBackgroundStyles = {
  bgGradient: "linear(to-br, #fffaf6 0%, #f2e8df 45%, #fdf7f1 100%)",
  position: "relative",
  _before: {
    content: '""',
    position: "absolute",
    top: "-140px",
    right: "-140px",
    w: "320px",
    h: "320px",
    bgGradient: "radial(#f0dccb 0%, transparent 70%)",
    opacity: 0.7,
    pointerEvents: "none",
  },
  _after: {
    content: '""',
    position: "absolute",
    inset: 0,
    bgImage: "radial-gradient(#eadfd6 1px, transparent 1px)",
    bgSize: "28px 28px",
    opacity: 0.18,
    pointerEvents: "none",
  },
};
