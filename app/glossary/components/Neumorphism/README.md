# Neumorphism Component - Styled-Components v6 & TypeScript for Next.js v15

This project has been converted from JavaScript/SCSS to TypeScript with styled-components v6, specifically optimized for Next.js v15 with App Router support. The neumorphism effect generator allows users to create beautiful soft UI elements with customizable shadows, colors, and shapes.

## 🚀 Features

- **Next.js v15 Compatible**: Full App Router support with proper SSR handling
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Styled-Components v6**: Modern CSS-in-JS with the latest features and optimizations
- **Server-Side Rendering**: Proper SSR setup with styled-components registry
- **Responsive Design**: Mobile-first approach with breakpoint handling
- **Real-time Preview**: Live updates as you adjust parameters
- **Code Generation**: Automatically generates CSS code for your designs
- **Shape Variants**: Flat, concave, convex, and pressed styles

## 📦 Installation

```bash
npm install next@^15.0.0 react@^18.2.0 react-dom@^18.2.0
npm install styled-components@^6.1.8 react-syntax-highlighter@^15.5.0
npm install -D @types/styled-components @types/react @types/react-syntax-highlighter typescript
```

## 🛠️ Next.js v15 Setup

### 1. Configure Next.js for Styled-Components

Create or update your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    styledComponents: true,
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
```

### 2. Set Up Styled-Components Registry

Use the provided `StyledComponentsRegistry.tsx` in your app layout:

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import StyledComponentsRegistry from './components/StyledComponentsRegistry';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
```

### 3. TypeScript Configuration

Update your `tsconfig.json` for Next.js v15:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

## 🎨 Usage

### Basic Usage

```tsx
'use client';

import Neumorphism from './components/Neumorphism';

export default function Page() {
  return (
    <main>
      <h1>Neumorphism Generator</h1>
      <Neumorphism />
    </main>
  );
}
```

### With Custom Styling

```tsx
'use client';

import Neumorphism from './components/Neumorphism';
import { Container } from './components/styles';

export default function Page() {
  return (
    <Container>
      <Neumorphism />
    </Container>
  );
}
```

## 🔧 Key Next.js v15 Improvements

### App Router Support
- **Server Components**: Proper SSR with styled-components registry
- **Client Components**: Marked with `'use client'` directive where needed
- **Streaming**: Compatible with React 18 streaming features

### Performance Optimizations
- **Bundle Splitting**: Optimized code splitting for styled-components
- **Tree Shaking**: Better dead code elimination
- **CSS Extraction**: Proper CSS extraction during build

### TypeScript Integration
- **Next.js Plugin**: Uses the official Next.js TypeScript plugin
- **Path Mapping**: Supports Next.js path aliases
- **Type Checking**: Full type safety with Next.js APIs

## 📁 File Structure

```
├── StyledComponentsRegistry.tsx  # SSR registry for styled-components
├── next.config.js               # Next.js configuration
├── next-env.d.ts               # Next.js environment types
├── layout-example.tsx          # Example layout implementation
├── types.ts                    # TypeScript interfaces
├── styles.ts                   # Styled-components definitions
├── utils.ts                    # Utility functions
├── styles.css                  # Global CSS variables
├── index.tsx                   # Main Neumorphism component
├── Preview.tsx                 # Preview component
├── Configuration.tsx           # Configuration panel
├── ConfigurationRow.tsx        # Configuration row component
└── ShapeSwitcher.tsx          # Shape selection component
```

## 🚨 Common Next.js v15 Issues & Solutions

### 1. Hydration Mismatch
**Problem**: Styled-components styles don't match between server and client.

**Solution**: Use the provided `StyledComponentsRegistry` component.

### 2. CSS-in-JS Not Working
**Problem**: Styles not applying in production.

**Solution**: Ensure `next.config.js` has styled-components compiler enabled.

### 3. TypeScript Errors
**Problem**: Module resolution issues with Next.js v15.

**Solution**: Use `moduleResolution: "bundler"` in `tsconfig.json`.

### 4. Build Errors
**Problem**: Build fails with styled-components.

**Solution**: Ensure all components using styled-components are client components (`'use client'`).

## 🔄 Migration from Previous Versions

### From Next.js v14
1. Update dependencies to Next.js v15
2. Update `tsconfig.json` with new module resolution
3. Ensure styled-components registry is properly set up

### From Pages Router
1. Move components to `app/` directory
2. Update imports and file structure
3. Add `'use client'` to components using hooks or browser APIs

## 🎯 Component Props

### LightSourceProps
```tsx
interface LightSourceProps {
  $top?: string;
  $bottom?: string;
  $right?: string;
  $left?: string;
  'data-value': string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}
```

### ConfigurationProps
```tsx
interface ConfigurationProps {
  previewBox: React.RefObject<HTMLDivElement | null>;
  activeLightSource: number;
}
```

## 🎨 Styling Architecture

The component uses a hybrid approach optimized for Next.js v15:
- **CSS Variables**: For dynamic theming and real-time updates
- **Styled-Components**: For component-specific styling and responsive design
- **Global CSS**: For base styles and utility classes
- **SSR Registry**: Proper server-side rendering support

## 📱 Responsive Design

The component includes comprehensive responsive breakpoints:
- **Desktop**: Full feature set with large preview
- **Tablet**: Adjusted sizing and spacing
- **Mobile**: Stacked layout with optimized controls

## 🚀 Performance Benefits

- **Next.js v15 Optimizations**: Latest performance improvements
- **Styled-Components v6**: Reduced bundle size and better tree shaking
- **Server-Side Rendering**: Proper SSR with no hydration mismatches
- **Code Splitting**: Optimized bundle splitting for better loading
- **TypeScript**: Compile-time optimizations and error catching

## 🤝 Contributing

1. Ensure Next.js v15 compatibility
2. Test with both development and production builds
3. Verify SSR works correctly
4. Follow TypeScript best practices
5. Test responsive design on various devices

## 📄 License

This project maintains the same license as the original codebase.

## 🔗 Related Documentation

- [Next.js v15 Documentation](https://nextjs.org/docs)
- [Styled-Components v6 Documentation](https://styled-components.com/docs)
- [TypeScript with Next.js](https://nextjs.org/docs/basic-features/typescript)
