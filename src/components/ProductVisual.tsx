import React from 'react';
import { VisualKind } from '../types/marketplace';

interface ProductVisualProps {
  kind: VisualKind;
  variantTint?: number;
  className?: string;
}

const STUDIO_BG: Record<VisualKind, { bg: string; accent: string; secondary: string }> = {
  headphones: { bg: '#F4F4F6', accent: '#1F242D', secondary: '#EE4D2D' },
  keyboard: { bg: '#F2F3F5', accent: '#262930', secondary: '#FF6B3D' },
  serum: { bg: '#FAF5EE', accent: '#B66A2C', secondary: '#E7C18E' },
  espresso: { bg: '#F3F2F0', accent: '#2D2A28', secondary: '#C87B41' },
  smartwatch: { bg: '#EFF3F8', accent: '#1E293B', secondary: '#F97316' },
  sneakers: { bg: '#F5F4F2', accent: '#EE4D2D', secondary: '#1F2937' },
  tote: { bg: '#F8F5EF', accent: '#B89B72', secondary: '#524636' },
  desklamp: { bg: '#F1F3F4', accent: '#23272F', secondary: '#FACC15' },
  blender: { bg: '#F0F6F5', accent: '#0F766E', secondary: '#99F6E4' },
  camera: { bg: '#F2F2F3', accent: '#18181B', secondary: '#D97706' },
  mouse: { bg: '#F3F4F6', accent: '#111827', secondary: '#EE4D2D' },
  jacket: { bg: '#F4F2EE', accent: '#3B4252', secondary: '#D8DEE9' },
  flask: { bg: '#F1F5F9', accent: '#1D4ED8', secondary: '#93C5FD' },
  diffuser: { bg: '#F7F5F2', accent: '#D6D3D1', secondary: '#A8A29E' },
  sunglasses: { bg: '#FBF7F0', accent: '#292524', secondary: '#D97706' },
  backpack: { bg: '#F2F4F7', accent: '#334155', secondary: '#64748B' },
  speaker: { bg: '#F3F4F6', accent: '#27272A', secondary: '#EE4D2D' },
  cream: { bg: '#FDF6F4', accent: '#F43F5E', secondary: '#FECDD3' },
  kettle: { bg: '#F4F5F6', accent: '#1E293B', secondary: '#94A3B8' },
  monitor: { bg: '#F0F2F5', accent: '#0F172A', secondary: '#38BDF8' },
  matcha: { bg: '#F2F7F1', accent: '#2E6F40', secondary: '#A3C9A8' },
  candle: { bg: '#FAF4ED', accent: '#92400E', secondary: '#FCD34D' },
  mic: { bg: '#F2F2F4', accent: '#1F2937', secondary: '#EF4444' },
  luggage: { bg: '#F4F3F6', accent: '#4C1D95', secondary: '#DDD6FE' },
  phonecase: { bg: '#EFF4FA', accent: '#1E293B', secondary: '#EE4D2D' },
};

const TINTS = [
  'hue-rotate-0',
  'hue-rotate-15 saturate-95',
  '-hue-rotate-15 contrast-105',
  'saturate-75 brightness-95',
];

export const ProductVisual: React.FC<ProductVisualProps> = ({
  kind,
  variantTint = 0,
  className = '',
}) => {
  const palette = STUDIO_BG[kind];
  const tintClass = TINTS[variantTint % TINTS.length];

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${tintClass} ${className}`}
      style={{ backgroundColor: palette.bg }}
    >
      {/* Subtle studio floor ellipse */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        role="img"
        aria-label={`${kind} studio product illustration`}
      >
        <defs>
          <radialGradient id={`glow-${kind}-${variantTint}`} cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor={palette.bg} stopOpacity="0.1" />
          </radialGradient>
          <filter id={`shadow-${kind}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.12" />
          </filter>
        </defs>

        <rect width="200" height="200" fill={`url(#glow-${kind}-${variantTint})`} />
        <ellipse cx="100" cy="166" rx="54" ry="9" fill="#000000" fillOpacity="0.08" />

        {kind === 'headphones' && (
          <g filter={`url(#shadow-${kind})`}>
            <path d="M52 108 C52 62, 148 62, 148 108" fill="none" stroke={palette.accent} strokeWidth="11" strokeLinecap="round" />
            <path d="M60 100 C60 68, 140 68, 140 100" fill="none" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
            <rect x="40" y="96" width="22" height="44" rx="11" fill={palette.accent} />
            <rect x="46" y="102" width="12" height="32" rx="6" fill="#374151" />
            <rect x="138" y="96" width="22" height="44" rx="11" fill={palette.accent} />
            <rect x="142" y="102" width="12" height="32" rx="6" fill="#374151" />
            <circle cx="46" cy="118" r="3" fill={palette.secondary} />
            <circle cx="154" cy="118" r="3" fill={palette.secondary} />
          </g>
        )}

        {kind === 'keyboard' && (
          <g filter={`url(#shadow-${kind})`} transform="translate(0, 6)">
            <rect x="28" y="68" width="144" height="68" rx="6" fill={palette.accent} />
            <rect x="34" y="74" width="132" height="56" rx="3" fill="#111827" />
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => {
                const isEsc = row === 0 && col === 0;
                const isEnter = row === 2 && col === 9;
                const keyColor = isEsc || isEnter ? palette.secondary : '#E5E7EB';
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={38 + col * 12.5}
                    y={78 + row * 12}
                    width={10}
                    height={9}
                    rx="1.5"
                    fill={keyColor}
                  />
                );
              })
            )}
            <rect x="64" y="116" width="66" height="9" rx="2" fill="#D1D5DB" />
          </g>
        )}

        {kind === 'serum' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="86" y="34" width="28" height="22" rx="6" fill="#1F2937" />
            <rect x="82" y="54" width="36" height="14" rx="2" fill="#D4AF37" />
            <path d="M74 72 Q74 66 84 66 L116 66 Q126 66 126 72 L128 152 Q128 160 118 160 L82 160 Q72 160 72 152 Z" fill={palette.accent} />
            <path d="M78 76 L84 76 L84 152 L78 152 Z" fill="#FFFFFF" fillOpacity="0.25" />
            <rect x="76" y="92" width="48" height="46" rx="2" fill="#FFFDF9" />
            <rect x="84" y="102" width="32" height="3" fill="#292524" />
            <rect x="88" y="110" width="24" height="2" fill="#78716C" />
            <circle cx="100" cy="126" r="6" fill={palette.secondary} />
          </g>
        )}

        {kind === 'espresso' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="52" y="42" width="96" height="118" rx="6" fill={palette.accent} />
            <rect x="56" y="46" width="88" height="26" rx="3" fill="#44403C" />
            <circle cx="100" cy="59" r="9" fill="#E7E5E4" />
            <circle cx="100" cy="59" r="5" fill={palette.secondary} />
            <rect x="64" y="76" width="72" height="62" fill="#1C1917" />
            <rect x="86" y="76" width="28" height="14" rx="2" fill="#A8A29E" />
            <rect x="114" y="81" width="34" height="5" rx="2" fill="#D6D3D1" />
            <path d="M84 112 L116 112 L112 136 L88 136 Z" fill="#FFFFFF" />
            <path d="M116 116 C124 116 124 128 114 128" fill="none" stroke="#FFFFFF" strokeWidth="3.5" />
            <rect x="52" y="144" width="96" height="16" rx="2" fill="#78716C" />
          </g>
        )}

        {kind === 'smartwatch' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="80" y="28" width="40" height="36" rx="6" fill="#334155" />
            <rect x="80" y="136" width="40" height="36" rx="6" fill="#334155" />
            <rect x="62" y="54" width="76" height="92" rx="20" fill="#1E293B" stroke="#94A3B8" strokeWidth="3" />
            <rect x="70" y="62" width="60" height="76" rx="14" fill="#0F172A" />
            <circle cx="100" cy="100" r="22" fill="none" stroke={palette.secondary} strokeWidth="4" strokeDasharray="105 35" />
            <text x="100" y="98" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="700" fontFamily="Work Sans">10:25</text>
            <text x="100" y="114" textAnchor="middle" fill="#38BDF8" fontSize="8" fontWeight="600" fontFamily="Inter">8,420 STEPS</text>
            <rect x="138" y="84" width="6" height="16" rx="2" fill="#64748B" />
          </g>
        )}

        {kind === 'sneakers' && (
          <g filter={`url(#shadow-${kind})`} transform="translate(0, 8)">
            <path d="M32 128 C36 106, 52 94, 70 90 L92 66 L122 86 C138 96, 166 102, 168 124 L168 134 L32 134 Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
            <path d="M30 132 L170 132 L166 144 L34 144 Z" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1.5" />
            <path d="M62 114 C86 114, 114 96, 134 102 L120 120 C98 122, 74 124, 58 122 Z" fill={palette.accent} />
            <line x1="94" y1="74" x2="106" y2="82" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
            <line x1="88" y1="81" x2="100" y2="89" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
            <line x1="82" y1="88" x2="94" y2="96" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {kind === 'tote' && (
          <g filter={`url(#shadow-${kind})`}>
            <path d="M76 74 C76 42, 124 42, 124 74" fill="none" stroke={palette.secondary} strokeWidth="6" strokeLinecap="round" />
            <path d="M56 72 L144 72 L152 158 L48 158 Z" fill="#EDE4D3" stroke="#D6C7AE" strokeWidth="2" />
            <rect x="66" y="92" width="68" height="46" rx="2" fill={palette.accent} fillOpacity="0.22" />
            <circle cx="100" cy="115" r="14" fill={palette.accent} />
            <line x1="56" y1="82" x2="144" y2="82" stroke={palette.secondary} strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
        )}

        {kind === 'desklamp' && (
          <g filter={`url(#shadow-${kind})`}>
            <ellipse cx="100" cy="154" rx="34" ry="9" fill={palette.accent} />
            <path d="M100 150 L74 102 L114 58" fill="none" stroke={palette.accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="74" cy="102" r="5" fill="#9CA3AF" />
            <path d="M104 54 L144 74 L126 88 L98 66 Z" fill={palette.accent} />
            <polygon points="124,84 142,75 154,132 106,132" fill={palette.secondary} fillOpacity="0.24" />
          </g>
        )}

        {kind === 'blender' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="66" y="122" width="68" height="38" rx="6" fill={palette.accent} />
            <circle cx="100" cy="141" r="9" fill="#FFFFFF" />
            <circle cx="100" cy="141" r="4" fill={palette.accent} />
            <path d="M72 54 L128 54 L122 122 L78 122 Z" fill="#E0F2FE" fillOpacity="0.85" stroke="#94A3B8" strokeWidth="2" />
            <path d="M76 80 L124 80 L120 120 L80 120 Z" fill="#F97316" fillOpacity="0.7" />
            <rect x="68" y="42" width="64" height="12" rx="4" fill="#134E4A" />
          </g>
        )}

        {kind === 'camera' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="44" y="64" width="112" height="78" rx="8" fill={palette.accent} />
            <rect x="44" y="64" width="112" height="22" rx="4" fill="#D4D4D8" />
            <rect x="74" y="52" width="38" height="14" rx="3" fill="#27272A" />
            <circle cx="104" cy="106" r="28" fill="#3F3F46" stroke="#E4E4E7" strokeWidth="4" />
            <circle cx="104" cy="106" r="18" fill="#09090B" />
            <circle cx="98" cy="100" r="5" fill="#60A5FA" fillOpacity="0.55" />
            <circle cx="138" cy="58" r="5" fill={palette.secondary} />
          </g>
        )}

        {kind === 'mouse' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="68" y="42" width="64" height="114" rx="32" fill={palette.accent} />
            <line x1="100" y1="42" x2="100" y2="88" stroke="#374151" strokeWidth="2" />
            <rect x="95" y="56" width="10" height="20" rx="5" fill={palette.secondary} />
            <path d="M74 126 C84 140, 116 140, 126 126" fill="none" stroke={palette.secondary} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {kind === 'jacket' && (
          <g filter={`url(#shadow-${kind})`}>
            <path d="M70 46 L40 72 L52 114 L66 108 L66 154 L134 154 L134 108 L148 114 L160 72 L130 46 L112 56 L88 56 Z" fill={palette.accent} />
            <line x1="100" y1="56" x2="100" y2="154" stroke="#E5E7EB" strokeWidth="2.5" />
            <rect x="74" y="96" width="18" height="22" rx="2" fill="#2E3440" />
            <rect x="108" y="96" width="18" height="22" rx="2" fill="#2E3440" />
          </g>
        )}

        {kind === 'flask' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="82" y="34" width="36" height="16" rx="4" fill="#1E293B" />
            <path d="M84 50 L116 50 L124 68 L124 152 Q124 160 116 160 L84 160 Q76 160 76 152 L76 68 Z" fill={palette.accent} />
            <rect x="84" y="68" width="8" height="82" rx="4" fill="#FFFFFF" fillOpacity="0.22" />
            <rect x="76" y="138" width="48" height="12" fill="#0F172A" fillOpacity="0.25" />
          </g>
        )}

        {kind === 'diffuser' && (
          <g filter={`url(#shadow-${kind})`}>
            <line x1="94" y1="36" x2="88" y2="92" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
            <line x1="102" y1="32" x2="100" y2="92" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            <line x1="112" y1="38" x2="110" y2="92" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
            <rect x="72" y="84" width="56" height="74" rx="10" fill="#FAFAF9" stroke="#D6D3D1" strokeWidth="2" />
            <rect x="82" y="106" width="36" height="30" rx="2" fill="#E7E5E4" />
            <rect x="88" y="116" width="24" height="3" fill="#57534E" />
          </g>
        )}

        {kind === 'sunglasses' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="34" y="78" width="56" height="42" rx="14" fill="#1C1917" stroke={palette.secondary} strokeWidth="4" />
            <rect x="110" y="78" width="56" height="42" rx="14" fill="#1C1917" stroke={palette.secondary} strokeWidth="4" />
            <path d="M90 92 Q100 84 110 92" fill="none" stroke={palette.secondary} strokeWidth="4" />
            <line x1="46" y1="88" x2="62" y2="110" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="4" strokeLinecap="round" />
            <line x1="122" y1="88" x2="138" y2="110" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {kind === 'backpack' && (
          <g filter={`url(#shadow-${kind})`}>
            <path d="M84 48 C84 34, 116 34, 116 48" fill="none" stroke="#1E293B" strokeWidth="6" />
            <rect x="58" y="48" width="84" height="110" rx="18" fill={palette.accent} />
            <rect x="68" y="98" width="64" height="48" rx="8" fill="#1E293B" />
            <line x1="74" y1="112" x2="126" y2="112" stroke="#94A3B8" strokeWidth="2" />
            <rect x="92" y="70" width="16" height="6" rx="2" fill="#CBD5E1" />
          </g>
        )}

        {kind === 'speaker' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="64" y="42" width="72" height="116" rx="20" fill={palette.accent} />
            <circle cx="100" cy="80" r="20" fill="#18181B" stroke="#52525B" strokeWidth="3" />
            <circle cx="100" cy="80" r="7" fill={palette.secondary} />
            <circle cx="100" cy="128" r="14" fill="#18181B" stroke="#52525B" strokeWidth="2.5" />
          </g>
        )}

        {kind === 'cream' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="62" y="68" width="76" height="22" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            <rect x="58" y="90" width="84" height="64" rx="10" fill={palette.secondary} stroke="#FDA4AF" strokeWidth="2" />
            <rect x="74" y="108" width="52" height="26" rx="3" fill="#FFFFFF" />
            <rect x="82" y="117" width="36" height="4" fill={palette.accent} />
          </g>
        )}

        {kind === 'kettle' && (
          <g filter={`url(#shadow-${kind})`}>
            <path d="M52 132 Q42 96 64 76" fill="none" stroke={palette.accent} strokeWidth="6" strokeLinecap="round" />
            <path d="M132 76 C158 76, 158 134, 132 134" fill="none" stroke="#334155" strokeWidth="7" />
            <path d="M68 62 L132 62 L140 148 L60 148 Z" fill={palette.accent} />
            <ellipse cx="100" cy="62" rx="32" ry="6" fill="#475569" />
            <circle cx="100" cy="52" r="6" fill="#0F172A" />
            <rect x="58" y="148" width="84" height="10" rx="3" fill="#0F172A" />
          </g>
        )}

        {kind === 'monitor' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="34" y="48" width="132" height="82" rx="4" fill="#0F172A" />
            <rect x="40" y="54" width="120" height="70" rx="2" fill="#1E293B" />
            <polygon points="40,124 94,74 160,124" fill={palette.secondary} fillOpacity="0.45" />
            <rect x="92" y="130" width="16" height="20" fill="#64748B" />
            <rect x="72" y="150" width="56" height="6" rx="2" fill="#475569" />
          </g>
        )}

        {kind === 'matcha' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="66" y="60" width="68" height="94" rx="8" fill={palette.accent} />
            <rect x="66" y="54" width="68" height="14" rx="4" fill="#1B4332" />
            <rect x="74" y="84" width="52" height="48" rx="2" fill="#FFFDF7" />
            <circle cx="100" cy="104" r="10" fill={palette.secondary} />
            <rect x="84" y="120" width="32" height="3" fill="#1B4332" />
          </g>
        )}

        {kind === 'candle' && (
          <g filter={`url(#shadow-${kind})`}>
            <path d="M100 44 Q108 56 100 66 Q92 56 100 44 Z" fill="#F59E0B" />
            <rect x="70" y="72" width="60" height="82" rx="6" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
            <rect x="78" y="96" width="44" height="36" rx="2" fill="#FFFFFF" />
            <rect x="86" y="110" width="28" height="3" fill={palette.accent} />
          </g>
        )}

        {kind === 'mic' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="80" y="38" width="40" height="72" rx="20" fill="#374151" />
            <rect x="80" y="74" width="40" height="36" rx="4" fill={palette.accent} />
            <path d="M68 82 C68 124, 132 124, 132 82" fill="none" stroke="#6B7280" strokeWidth="5" />
            <rect x="96" y="118" width="8" height="28" fill="#4B5563" />
            <ellipse cx="100" cy="150" rx="28" ry="6" fill="#1F2937" />
          </g>
        )}

        {kind === 'luggage' && (
          <g filter={`url(#shadow-${kind})`}>
            <path d="M86 30 L86 58 M114 30 L114 58 M84 30 L116 30" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
            <rect x="64" y="56" width="72" height="94" rx="10" fill={palette.accent} />
            <line x1="80" y1="68" x2="80" y2="138" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="4" strokeLinecap="round" />
            <line x1="100" y1="68" x2="100" y2="138" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="4" strokeLinecap="round" />
            <line x1="120" y1="68" x2="120" y2="138" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="4" strokeLinecap="round" />
            <circle cx="76" cy="154" r="5" fill="#1E293B" />
            <circle cx="124" cy="154" r="5" fill="#1E293B" />
          </g>
        )}

        {kind === 'phonecase' && (
          <g filter={`url(#shadow-${kind})`}>
            <rect x="66" y="34" width="68" height="128" rx="14" fill={palette.accent} />
            <rect x="70" y="38" width="60" height="120" rx="11" fill="#334155" />
            {/* Camera bump */}
            <rect x="75" y="44" width="24" height="26" rx="6" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="82" cy="51" r="4" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="82" cy="63" r="4" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="92" cy="57" r="4" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
            {/* MagSafe magnetic ring */}
            <circle cx="100" cy="102" r="20" fill="none" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="4" strokeDasharray="106 18" />
            <line x1="100" y1="126" x2="100" y2="136" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="4" strokeLinecap="round" />
            {/* Bumper accent corner */}
            <circle cx="128" cy="148" r="3" fill={palette.secondary} />
          </g>
        )}
      </svg>
    </div>
  );
};
