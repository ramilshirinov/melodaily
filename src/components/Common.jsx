import React from 'react';
import { Info } from 'lucide-react';
import { COLORS, displayFont, accentFont, bodyFont } from '../constants/data';

export function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke={COLORS.gold} strokeWidth="1.4" />
      <circle cx="24" cy="24" r="17.5" stroke={COLORS.gold} strokeWidth="0.6" opacity="0.5" />
      <path
        d="M11 32V16.5L18 27L24.5 16.5V32"
        stroke={COLORS.gold}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M29 32V17c4-1.4 8 0.4 8 4.2c0 3.2-2.6 4.6-5.2 4.6"
        stroke={COLORS.gold}
        strokeWidth="2.1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="29" cy="32.4" r="2.1" fill={COLORS.gold} />
    </svg>
  );
}

export function ButaMotif({ opacity = 0.5, stroke = COLORS.gold }) {
  return (
    <path
      d="M0 8 C 0 3, 5 0, 8 0 C 11 0, 16 3, 16 8 C 16 12, 12 13, 10 16 C 9 17.5, 9.5 19, 11 19"
      stroke={stroke}
      strokeWidth="0.7"
      fill="none"
      opacity={opacity}
    />
  );
}

export function VinylArt({ colors, spinning, size = 64, label }) {
  const rings = [22, 18, 14, 10];
  return (
    <div
      className="relative rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 30%, ${colors[0]}33, ${colors[1]} 70%)`,
        boxShadow: 'inset 0 0 14px rgba(0,0,0,0.5), 0 3px 10px rgba(0,0,0,0.25)',
        animation: spinning ? 'melo-spin 6s linear infinite' : 'none',
      }}
      title={label}
    >
      <svg width={size} height={size} viewBox="0 0 48 48" className="absolute inset-0">
        {rings.map((r, i) => (
          <circle key={i} cx="24" cy="24" r={r} stroke={colors[0]} strokeOpacity={0.35 - i * 0.05} strokeWidth="0.5" fill="none" />
        ))}
        <g transform="translate(9,9) scale(0.6)">
          <ButaMotif opacity={0.35} stroke={colors[0]} />
        </g>
        <g transform="translate(30,6) scale(0.5) rotate(90)">
          <ButaMotif opacity={0.3} stroke={colors[0]} />
        </g>
        <g transform="translate(24,30) scale(0.55) rotate(200)">
          <ButaMotif opacity={0.3} stroke={colors[0]} />
        </g>
      </svg>
      <div
        className="rounded-full z-10"
        style={{ width: size * 0.22, height: size * 0.22, background: COLORS.cream, boxShadow: '0 0 0 1.5px ' + colors[0] }}
      />
    </div>
  );
}

export function MoodBadge({ mood }) {
  return (
    <span
      className="text-[11px] tracking-wide px-2.5 py-1 rounded-full border"
      style={{ borderColor: COLORS.gold, color: COLORS.gold, ...bodyFont }}
    >
      {mood}
    </span>
  );
}

export function DecadeBadge({ decade }) {
  return (
    <span
      className="text-[11px] tracking-wide px-2.5 py-1 rounded-full"
      style={{ background: 'rgba(197,160,89,0.15)', color: COLORS.creamDeep, ...bodyFont }}
    >
      {decade}
    </span>
  );
}

export function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 style={{ ...displayFont, color: COLORS.bronze, fontSize: 26 }}>{title}</h2>
      {subtitle && <p style={{ ...accentFont, color: COLORS.inkGold, fontSize: 15, fontStyle: 'italic' }} className="mt-0.5">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-dashed py-10 text-center" style={{ borderColor: COLORS.inkGold }}>
      <Info size={20} className="mx-auto mb-2" style={{ color: COLORS.inkGold }} />
      <p style={{ ...bodyFont, color: COLORS.inkGold, fontSize: 13.5 }}>{text}</p>
    </div>
  );
}