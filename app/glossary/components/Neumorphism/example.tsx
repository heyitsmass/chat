'use client';

import React from 'react';
import Neumorphism from './index';

// Example usage of the Neumorphism component in Next.js v15
export default function NeumorphismPage() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      background: 'var(--baseColor, #e0e0e0)',
      padding: '20px'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px' 
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: 'var(--textColor, #001f3f)',
          marginBottom: '10px'
        }}>
          Neumorphism Generator
        </h1>
        <h2 style={{ 
          fontSize: '1.25rem', 
          color: 'var(--textColor, #001f3f)',
          opacity: 0.8
        }}>
          Create beautiful soft UI elements with styled-components v6 & Next.js v15
        </h2>
      </div>
      
      <Neumorphism />
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px',
        color: 'var(--textColor, #001f3f)',
        opacity: 0.7
      }}>
        <p>
          Adjust the controls above to customize your neumorphic design.
          The generated CSS code will update in real-time.
        </p>
        <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
          Compatible with Next.js v15 App Router and styled-components v6
        </p>
      </div>
    </main>
  );
}
