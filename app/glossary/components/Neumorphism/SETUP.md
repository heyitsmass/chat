# Quick Setup Guide for Next.js v15

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install next@^15.0.0 react@^18.2.0 react-dom@^18.2.0 styled-components@^6.1.8 react-syntax-highlighter@^15.5.0
npm install -D @types/styled-components @types/react @types/react-syntax-highlighter typescript eslint eslint-config-next
```

### 2. Copy Required Files
Copy these files to your Next.js project:
- `StyledComponentsRegistry.tsx` → `app/components/`
- `next.config.js` → root directory
- `tsconfig.json` → root directory (or merge with existing)
- All component files (`*.tsx`, `*.ts`) → `app/components/neumorphism/`
- `styles.css` → `app/components/neumorphism/`

### 3. Update Your Layout
```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import StyledComponentsRegistry from './components/StyledComponentsRegistry';

export const metadata: Metadata = {
  title: 'Your App',
  description: 'Your app description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
```

### 4. Use the Component
```tsx
// app/page.tsx
'use client';

import Neumorphism from './components/neumorphism';

export default function Home() {
  return (
    <main>
      <h1>Neumorphism Generator</h1>
      <Neumorphism />
    </main>
  );
}
```

### 5. Run Your App
```bash
npm run dev
```

## 🔧 Troubleshooting

### Common Issues:

1. **Hydration Mismatch**: Ensure `StyledComponentsRegistry` is properly set up in layout
2. **Styles Not Loading**: Check that `next.config.js` has styled-components compiler enabled
3. **TypeScript Errors**: Ensure `moduleResolution: "bundler"` in `tsconfig.json`
4. **Build Errors**: Make sure components using hooks have `'use client'` directive

### Verification Checklist:
- [ ] `StyledComponentsRegistry` in layout
- [ ] `next.config.js` configured
- [ ] All components have proper `'use client'` directives
- [ ] TypeScript configuration updated
- [ ] Dependencies installed

## 📁 File Structure After Setup
```
your-nextjs-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── components/
│       ├── StyledComponentsRegistry.tsx
│       └── neumorphism/
│           ├── index.tsx
│           ├── Preview.tsx
│           ├── Configuration.tsx
│           ├── ConfigurationRow.tsx
│           ├── ShapeSwitcher.tsx
│           ├── styles.ts
│           ├── styles.css
│           ├── types.ts
│           └── utils.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

That's it! Your neumorphism component should now work with Next.js v15.
