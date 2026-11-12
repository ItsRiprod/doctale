'use client';
// Phase 0 minimal version. WS-C owns this file: theme-derived colours, fullscreen on click, placeholder sizing.
import { useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';

export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [svg, setSvg] = useState('');
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { default: mermaid } = await import('mermaid');
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
      });
      const { svg } = await mermaid.render(`m${id}`, chart.replaceAll('\\n', '\n'));
      if (!cancelled) setSvg(svg);
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme]);

  // Click toggles fullscreen (ported from the Astro site's global click handler).
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
