'use client';
// Mermaid diagrams (```mermaid fences → <Mermaid chart> via remarkMdxMermaid in lib/source.ts).
// Colours come from the active site theme and re-render when the theme or light/dark changes; click toggles fullscreen.
import { useEffect, useId, useState } from 'react';
import { usePaletteKey } from '@/components/theme/store';

type RGB = [number, number, number];

// Theme colours are often oklch(), which Mermaid's colour maths can't parse: resolve through a 1×1 canvas to sRGB.
let ctx: CanvasRenderingContext2D | null = null;
function toRgb(color: string, fallback: RGB): RGB {
  ctx ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!ctx || !color) return fallback;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = '#000';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}
const hex = ([r, g, b]: RGB) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
const mix = (a: RGB, b: RGB, t: number): RGB => [0, 1, 2].map((i) => Math.round(a[i] * t + b[i] * (1 - t))) as RGB;

function themeVariables(dark: boolean) {
  const style = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: RGB) => toRgb(style.getPropertyValue(name).trim(), fallback);
  const bg = v('--background', dark ? [10, 10, 10] : [255, 255, 255]);
  const fg = v('--foreground', dark ? [240, 240, 240] : [20, 20, 20]);
  const card = v('--card', bg);
  const primary = v('--primary', [59, 130, 246]);
  const muted = v('--muted', mix(fg, bg, 0.08));
  const mutedFg = v('--muted-foreground', mix(fg, bg, 0.6));
  const border = v('--border', mix(fg, bg, 0.15));
  const chart2 = v('--chart-2', primary);
  const node = mix(primary, card, dark ? 0.22 : 0.12);
  return {
    darkMode: dark,
    fontFamily: style.getPropertyValue('--font-sans') || 'inherit',
    background: hex(bg),
    primaryColor: hex(node),
    primaryTextColor: hex(fg),
    primaryBorderColor: hex(primary),
    secondaryColor: hex(mix(chart2, card, dark ? 0.22 : 0.12)),
    secondaryBorderColor: hex(chart2),
    secondaryTextColor: hex(fg),
    tertiaryColor: hex(muted),
    tertiaryBorderColor: hex(border),
    tertiaryTextColor: hex(fg),
    lineColor: hex(mutedFg),
    textColor: hex(fg),
    mainBkg: hex(node),
    nodeBorder: hex(primary),
    clusterBkg: hex(mix(muted, bg, 0.6)),
    clusterBorder: hex(border),
    titleColor: hex(fg),
    edgeLabelBackground: hex(bg),
    noteBkgColor: hex(muted),
    noteTextColor: hex(fg),
    noteBorderColor: hex(border),
    actorBkg: hex(node),
    actorBorder: hex(primary),
    actorTextColor: hex(fg),
    signalColor: hex(fg),
    signalTextColor: hex(fg),
    labelBoxBkgColor: hex(node),
    labelBoxBorderColor: hex(primary),
    labelTextColor: hex(fg),
    loopTextColor: hex(fg),
  };
}

let renderQueue: Promise<unknown> = Promise.resolve();

export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [svg, setSvg] = useState('');
  const palette = usePaletteKey();

  useEffect(() => {
    let cancelled = false;
    // mermaid.initialize is global, so renders are serialised to keep each diagram on the right palette.
    renderQueue = renderQueue.then(async () => {
      if (cancelled) return;
      const { default: mermaid } = await import('mermaid');
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        themeVariables: themeVariables(palette.endsWith(':dark')),
      });
      try {
        const { svg } = await mermaid.render(`m${id}`, chart.replaceAll('\\n', '\n'));
        if (!cancelled) setSvg(svg);
      } catch (e) {
        console.error('Mermaid render failed', e);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [chart, id, palette]);

  return (
    <div
      className="fd-mermaid not-prose my-4 flex min-h-24 justify-center"
      title="Click to view fullscreen"
      onClick={(e) => {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void e.currentTarget.requestFullscreen().catch(() => {});
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
