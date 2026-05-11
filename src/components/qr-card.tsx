'use client';

import { Download, Printer } from 'lucide-react';
import { useRef } from 'react';
import QRCode from 'react-qr-code';

type Props = {
  url: string;
  fullName: string;
  birthYear: string;
  deathDate: string;
  labels: {
    subtitle: string;
    scanPrompt: string;
    downloadPng: string;
    print: string;
    printedBy: string;
  };
};

export function QrCard({ url, fullName, birthYear, deathDate, labels }: Props) {
  const svgRef = useRef<HTMLDivElement>(null);

  function handleDownload() {
    const svgEl = svgRef.current?.querySelector('svg');
    if (!svgEl) return;

    // Clone and add white background for clean PNG export
    const clone = svgEl.cloneNode(true) as SVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.insertAdjacentHTML(
      'afterbegin',
      '<rect width="100%" height="100%" fill="white"/>'
    );

    const serialised = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([serialised], { type: 'image/svg+xml' });
    const blobUrl = URL.createObjectURL(blob);

    // Render to canvas at 600×600 px for crisp print quality
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 600, 600);
      ctx.drawImage(img, 0, 0, 600, 600);
      URL.revokeObjectURL(blobUrl);

      const link = document.createElement('a');
      link.download = 'edwinchelliah-qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = blobUrl;
  }

  return (
    <div className="qr-wrapper flex flex-col items-center gap-8">
      {/* Card — this is what prints */}
      <div
        id="qr-print-card"
        className="qr-card flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-ink/10 bg-white px-8 py-10 shadow-soft dark:border-white/10 dark:bg-twilight"
      >
        {/* QR code */}
        <div ref={svgRef} className="rounded-xl bg-white p-3">
          <QRCode
            value={url}
            size={200}
            level="H"
            fgColor="#271f3d"
            bgColor="#ffffff"
          />
        </div>

        {/* Name and dates */}
        <div className="text-center">
          <p className="font-serif text-2xl text-ink dark:text-paper">{fullName}</p>
          <p className="mt-1 font-serif text-sm text-ink/60 dark:text-paper/60">
            {birthYear} – {deathDate}
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 border-t border-gold/60" />

        {/* Scan prompt */}
        <p className="text-center text-sm leading-6 text-ink/65 dark:text-paper/65">
          {labels.scanPrompt}
        </p>

        {/* URL */}
        <p className="rounded-full border border-ink/10 px-4 py-1.5 font-mono text-xs text-ink/50 dark:border-white/10 dark:text-paper/50">
          {url.replace('https://', '')}
        </p>

        {/* Printed-by note */}
        <p className="text-xs text-ink/30 dark:text-paper/30">{labels.printedBy}</p>
      </div>

      {/* Action buttons — hidden when printing */}
      <div className="no-print flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm text-paper transition hover:bg-clay focus:outline-none focus:ring-2 focus:ring-gold dark:bg-paper dark:text-ink"
        >
          <Download aria-hidden className="h-4 w-4" />
          {labels.downloadPng}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm text-ink transition hover:border-clay focus:outline-none focus:ring-2 focus:ring-gold dark:border-white/15 dark:text-paper"
        >
          <Printer aria-hidden className="h-4 w-4" />
          {labels.print}
        </button>
      </div>
    </div>
  );
}
