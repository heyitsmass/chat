import type { Metadata } from 'next';
import StyledComponentsRegistry from './StyledComponentsRegistry';
import './styles.css';

export const metadata: Metadata = {
  title: 'Neumorphism Generator',
  description: 'Create beautiful soft UI elements with styled-components v6 and Next.js v15',
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
