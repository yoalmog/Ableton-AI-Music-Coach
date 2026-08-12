import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';
import pngToIco from 'png-to-ico';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const publicBrandingDir = path.join(rootDir, 'public', 'branding');
const buildDir = path.join(rootDir, 'build');

if (!fs.existsSync(publicBrandingDir)) {
  fs.mkdirSync(publicBrandingDir, { recursive: true });
}
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// 1. FULL OFFICIAL LOGO SVG
const fullLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <!-- Background Gradients -->
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#142810" stop-opacity="0.9"/>
      <stop offset="40%" stop-color="#091820" stop-opacity="0.8"/>
      <stop offset="85%" stop-color="#0A0A0A" stop-opacity="1"/>
    </radialGradient>

    <!-- Lime & Cyan Gradients -->
    <linearGradient id="limeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B8FF33"/>
      <stop offset="50%" stop-color="#90FF00"/>
      <stop offset="100%" stop-color="#60C800"/>
    </linearGradient>

    <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00FFFF"/>
      <stop offset="50%" stop-color="#00E5FF"/>
      <stop offset="100%" stop-color="#0099CC"/>
    </linearGradient>

    <linearGradient id="silverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="25%" stop-color="#E2E8F0"/>
      <stop offset="50%" stop-color="#94A3B8"/>
      <stop offset="75%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#64748B"/>
    </linearGradient>

    <linearGradient id="haloRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#90FF00"/>
      <stop offset="50%" stop-color="#00E5FF"/>
      <stop offset="100%" stop-color="#90FF00"/>
    </linearGradient>

    <!-- Metallic Text Fill -->
    <linearGradient id="metalTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="35%" stop-color="#E2E8F0"/>
      <stop offset="50%" stop-color="#64748B"/>
      <stop offset="80%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#94A3B8"/>
    </linearGradient>

    <!-- Filters for Neon Glow -->
    <filter id="limeGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#000000" flood-opacity="0.9"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="1200" height="800" fill="#0A0A0A"/>
  <rect width="1200" height="800" fill="url(#bgGlow)"/>

  <!-- Audio Waveform Visualizer (Left - Lime Green) -->
  <g filter="url(#limeGlow)" opacity="0.85">
    <!-- Waveform Bars Left -->
    <rect x="60" y="380" width="8" height="40" rx="4" fill="url(#limeGradient)"/>
    <rect x="80" y="350" width="8" height="100" rx="4" fill="url(#limeGradient)"/>
    <rect x="100" y="310" width="8" height="180" rx="4" fill="url(#limeGradient)"/>
    <rect x="120" y="270" width="8" height="260" rx="4" fill="url(#limeGradient)"/>
    <rect x="140" y="240" width="8" height="320" rx="4" fill="url(#limeGradient)"/>
    <rect x="160" y="290" width="8" height="220" rx="4" fill="url(#limeGradient)"/>
    <rect x="180" y="330" width="8" height="140" rx="4" fill="url(#limeGradient)"/>
    <rect x="200" y="260" width="8" height="280" rx="4" fill="url(#limeGradient)"/>
    <rect x="220" y="220" width="8" height="360" rx="4" fill="url(#limeGradient)"/>
    <rect x="240" y="300" width="8" height="200" rx="4" fill="url(#limeGradient)"/>
    <rect x="260" y="340" width="8" height="120" rx="4" fill="url(#limeGradient)"/>
    <rect x="280" y="280" width="8" height="240" rx="4" fill="url(#limeGradient)"/>
    <rect x="300" y="250" width="8" height="300" rx="4" fill="url(#limeGradient)"/>
    <rect x="320" y="320" width="8" height="160" rx="4" fill="url(#limeGradient)"/>
  </g>

  <!-- Audio Waveform Visualizer (Right - Cyber Cyan) -->
  <g filter="url(#cyanGlow)" opacity="0.85">
    <rect x="870" y="320" width="8" height="160" rx="4" fill="url(#cyanGradient)"/>
    <rect x="890" y="250" width="8" height="300" rx="4" fill="url(#cyanGradient)"/>
    <rect x="910" y="280" width="8" height="240" rx="4" fill="url(#cyanGradient)"/>
    <rect x="930" y="340" width="8" height="120" rx="4" fill="url(#cyanGradient)"/>
    <rect x="950" y="300" width="8" height="200" rx="4" fill="url(#cyanGradient)"/>
    <rect x="970" y="220" width="8" height="360" rx="4" fill="url(#cyanGradient)"/>
    <rect x="990" y="260" width="8" height="280" rx="4" fill="url(#cyanGradient)"/>
    <rect x="1010" y="330" width="8" height="140" rx="4" fill="url(#cyanGradient)"/>
    <rect x="1030" y="290" width="8" height="220" rx="4" fill="url(#cyanGradient)"/>
    <rect x="1050" y="240" width="8" height="320" rx="4" fill="url(#cyanGradient)"/>
    <rect x="1070" y="270" width="8" height="260" rx="4" fill="url(#cyanGradient)"/>
    <rect x="1090" y="310" width="8" height="180" rx="4" fill="url(#cyanGradient)"/>
    <rect x="1110" y="350" width="8" height="100" rx="4" fill="url(#cyanGradient)"/>
    <rect x="1130" y="380" width="8" height="40" rx="4" fill="url(#cyanGradient)"/>
  </g>

  <!-- Central Glowing Circular Ring / Halo -->
  <g filter="url(#dropShadow)">
    <circle cx="600" cy="270" r="185" fill="none" stroke="url(#haloRingGrad)" stroke-width="6" opacity="0.9" filter="url(#limeGlow)"/>
    <circle cx="600" cy="270" r="170" fill="none" stroke="#00E5FF" stroke-width="2" opacity="0.6"/>
    <circle cx="600" cy="270" r="198" fill="none" stroke="#90FF00" stroke-width="1.5" stroke-dasharray="12 8" opacity="0.7"/>
  </g>

  <!-- HEADPHONES OVER THE TOP -->
  <g filter="url(#dropShadow)">
    <!-- Headband Arch -->
    <path d="M 410 280 C 410 120, 790 120, 790 280" fill="none" stroke="#222" stroke-width="32" stroke-linecap="round"/>
    <path d="M 410 280 C 410 120, 790 120, 790 280" fill="none" stroke="url(#silverGradient)" stroke-width="16" stroke-linecap="round"/>
    <path d="M 450 200 C 480 150, 720 150, 750 200" fill="none" stroke="#90FF00" stroke-width="4" filter="url(#limeGlow)"/>

    <!-- Left Ear Cup -->
    <g transform="translate(380, 240)">
      <rect x="0" y="0" width="45" height="100" rx="20" fill="#151515" stroke="url(#silverGradient)" stroke-width="4"/>
      <rect x="10" y="10" width="25" height="80" rx="12" fill="#90FF00" opacity="0.85" filter="url(#limeGlow)"/>
      <rect x="15" y="15" width="15" height="70" rx="8" fill="#0A0A0A"/>
    </g>

    <!-- Right Ear Cup -->
    <g transform="translate(775, 240)">
      <rect x="0" y="0" width="45" height="100" rx="20" fill="#151515" stroke="url(#silverGradient)" stroke-width="4"/>
      <rect x="10" y="10" width="25" height="80" rx="12" fill="#00E5FF" opacity="0.85" filter="url(#cyanGlow)"/>
      <rect x="15" y="15" width="15" height="70" rx="8" fill="#0A0A0A"/>
    </g>
  </g>

  <!-- STYLIZED 'A' LOGO ICON -->
  <g filter="url(#dropShadow)">
    <!-- Left Leg of A (Neon Lime) -->
    <path d="M 600 130 L 460 380 L 525 380 L 600 240 Z" fill="url(#limeGradient)" filter="url(#limeGlow)"/>
    <!-- Right Leg of A (Metallic Silver) -->
    <path d="M 600 130 L 740 380 L 675 380 L 600 240 Z" fill="url(#silverGradient)"/>

    <!-- Inner Horizontal Crossbar with Ableton 4-Bar Icon -->
    <g transform="translate(560, 310)">
      <!-- 4 Vertical Bars -->
      <rect x="0" y="0" width="6" height="26" fill="#90FF00"/>
      <rect x="10" y="0" width="6" height="26" fill="#90FF00"/>
      <rect x="20" y="0" width="6" height="26" fill="#00E5FF"/>
      <rect x="30" y="0" width="6" height="26" fill="#00E5FF"/>

      <!-- 4 Horizontal Bars -->
      <rect x="46" y="0" width="28" height="5" fill="#90FF00"/>
      <rect x="46" y="7" width="28" height="5" fill="#90FF00"/>
      <rect x="46" y="14" width="28" height="5" fill="#00E5FF"/>
      <rect x="46" y="21" width="28" height="5" fill="#00E5FF"/>
    </g>
  </g>

  <!-- TYPOGRAPHY: ABLETON -->
  <g filter="url(#dropShadow)">
    <text x="600" y="525" 
          font-family="Arial, Helvetica, sans-serif" 
          font-size="108" 
          font-weight="900" 
          letter-spacing="12" 
          text-anchor="middle" 
          fill="url(#metalTextGrad)"
          stroke="#00E5FF"
          stroke-width="1.5">
      ABLETON
    </text>
  </g>

  <!-- NEON LIME BADGE: AI MUSIC COACH -->
  <g transform="translate(260, 560)" filter="url(#dropShadow)">
    <!-- Outer Pill Border -->
    <rect x="0" y="0" width="680" height="75" rx="37.5" fill="#0F1A0A" stroke="#90FF00" stroke-width="4" filter="url(#limeGlow)"/>
    
    <!-- Wave icon left -->
    <path d="M 40 37.5 Q 50 20 60 37.5 T 80 37.5" fill="none" stroke="#90FF00" stroke-width="4"/>

    <!-- Text AI MUSIC COACH -->
    <text x="110" y="52" 
          font-family="Arial, Helvetica, sans-serif" 
          font-size="46" 
          font-weight="900" 
          letter-spacing="4" 
          fill="#90FF00">
      AI
    </text>
    <text x="175" y="52" 
          font-family="Arial, Helvetica, sans-serif" 
          font-size="46" 
          font-weight="900" 
          letter-spacing="6" 
          fill="#FFFFFF">
      MUSIC COACH
    </text>

    <!-- Wave icon right -->
    <path d="M 600 37.5 Q 610 20 620 37.5 T 640 37.5" fill="none" stroke="#00E5FF" stroke-width="4"/>
  </g>

  <!-- SUBTITLE: AI MUSIC PRODUCTION WORKSTATION -->
  <g transform="translate(600, 685)">
    <!-- Flanking Lines -->
    <line x1="-420" y1="-8" x2="-220" y2="-8" stroke="#00E5FF" stroke-width="2" opacity="0.8"/>
    <line x1="220" y1="-8" x2="420" y2="-8" stroke="#00E5FF" stroke-width="2" opacity="0.8"/>
    
    <text x="0" y="0" 
          font-family="Arial, Helvetica, sans-serif" 
          font-size="22" 
          font-weight="700" 
          letter-spacing="10" 
          text-anchor="middle" 
          fill="#E2E8F0">
      AI MUSIC PRODUCTION WORKSTATION
    </text>
  </g>
</svg>`;

// 2. ICON SYMBOL ONLY SVG (For Windows Tray, Desktop Shortcut, Taskbar)
const symbolSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="symbolBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#142810"/>
      <stop offset="60%" stop-color="#091820"/>
      <stop offset="100%" stop-color="#0A0A0A"/>
    </radialGradient>

    <linearGradient id="limeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B8FF33"/>
      <stop offset="100%" stop-color="#60C800"/>
    </linearGradient>

    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00FFFF"/>
      <stop offset="100%" stop-color="#0099CC"/>
    </linearGradient>

    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>

    <filter id="symbolGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Rounded Squircle Dark Container -->
  <rect x="8" y="8" width="496" height="496" rx="96" fill="url(#symbolBg)" stroke="#333333" stroke-width="4"/>

  <!-- Halo Ring -->
  <circle cx="256" cy="256" r="180" fill="none" stroke="#90FF00" stroke-width="6" opacity="0.7" filter="url(#symbolGlow)"/>

  <!-- Headphones -->
  <!-- Headband -->
  <path d="M 130 260 C 130 130, 382 130, 382 260" fill="none" stroke="url(#silverGrad)" stroke-width="22" stroke-linecap="round"/>
  <!-- Left Cup -->
  <rect x="100" y="220" width="36" height="90" rx="18" fill="#151515" stroke="url(#limeGrad)" stroke-width="4"/>
  <!-- Right Cup -->
  <rect x="376" y="220" width="36" height="90" rx="18" fill="#151515" stroke="url(#cyanGrad)" stroke-width="4"/>

  <!-- STYLIZED 'A' LOGO -->
  <!-- Left Leg (Lime) -->
  <path d="M 256 120 L 150 340 L 200 340 L 256 220 Z" fill="url(#limeGrad)" filter="url(#symbolGlow)"/>
  <!-- Right Leg (Silver) -->
  <path d="M 256 120 L 362 340 L 312 340 L 256 220 Z" fill="url(#silverGrad)"/>

  <!-- Ableton 4-Bar Matrix in Center -->
  <g transform="translate(225, 290)">
    <rect x="0" y="0" width="5" height="20" fill="#90FF00"/>
    <rect x="8" y="0" width="5" height="20" fill="#90FF00"/>
    <rect x="16" y="0" width="5" height="20" fill="#00E5FF"/>
    <rect x="24" y="0" width="5" height="20" fill="#00E5FF"/>

    <rect x="36" y="0" width="22" height="4" fill="#90FF00"/>
    <rect x="36" y="5" width="22" height="4" fill="#90FF00"/>
    <rect x="36" y="10" width="22" height="4" fill="#00E5FF"/>
    <rect x="36" y="15" width="22" height="4" fill="#00E5FF"/>
  </g>

  <!-- AI Badge at bottom -->
  <rect x="166" y="380" width="180" height="48" rx="24" fill="#0A0A0A" stroke="#90FF00" stroke-width="3"/>
  <text x="256" y="413" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="#90FF00" text-anchor="middle" letter-spacing="3">
    AI COACH
  </text>
</svg>`;

async function generateAssets() {
  console.log('Generating official branding assets...');

  // Save SVGs
  const logoSvgPath = path.join(publicBrandingDir, 'logo.svg');
  const symbolSvgPath = path.join(publicBrandingDir, 'symbol.svg');
  fs.writeFileSync(logoSvgPath, fullLogoSvg, 'utf8');
  fs.writeFileSync(symbolSvgPath, symbolSvg, 'utf8');

  try {
    // Convert SVGs to PNGs using resvg
    const resvgLogo = new Resvg(fullLogoSvg, {
      fitTo: { mode: 'width', value: 1200 },
    });
    const logoPngBuffer = resvgLogo.render().asPng();
    fs.writeFileSync(path.join(publicBrandingDir, 'logo.png'), logoPngBuffer);

    const resvgSymbol = new Resvg(symbolSvg, {
      fitTo: { mode: 'width', value: 512 },
    });
    const symbolPngBuffer = resvgSymbol.render().asPng();
    fs.writeFileSync(path.join(publicBrandingDir, 'symbol.png'), symbolPngBuffer);
    fs.writeFileSync(path.join(buildDir, 'icon.png'), symbolPngBuffer);

    // Generate multi-resolution PNG buffers for ICO creation
    const sizes = [16, 24, 32, 48, 64, 128, 256];
    const pngBuffers = [];

    for (const size of sizes) {
      const resvgSize = new Resvg(symbolSvg, {
        fitTo: { mode: 'width', value: size },
      });
      const pngBuf = resvgSize.render().asPng();
      const sizePath = path.join(buildDir, `icon-${size}.png`);
      fs.writeFileSync(sizePath, pngBuf);
      pngBuffers.push(pngBuf);
    }

    // Generate build/icon.ico using png-to-ico
    try {
      const icoBuffer = await pngToIco(pngBuffers);
      fs.writeFileSync(path.join(buildDir, 'icon.ico'), icoBuffer);
      console.log('Successfully generated build/icon.ico with multi-resolution targets!');
    } catch (err) {
      console.error('Error creating ICO file:', err);
    }
  } catch (err) {
    console.warn('Resvg rendering skipped or native binding missing, using default static asset fallbacks if available:', err.message);
  }

  console.log('All branding assets generated successfully!');
}

generateAssets();
