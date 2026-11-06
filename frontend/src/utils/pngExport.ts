import type { CrocColor, CrocSize, PlacedJibbitz } from '@crocs/shared';
import { EXPORT_WATERMARK_LINES } from '@crocs/shared';
import { SHOE_HOLES_BY_SIZE } from '../components/canvas/shoeHoleConfig.js';
import { SHOE_VIEWBOX } from '../components/canvas/crocsSvgData.js';

export interface PngExportOptions {
  size: CrocSize;
  color: CrocColor;
  placements: PlacedJibbitz[];
  leftSvg: SVGSVGElement | null;
  rightSvg: SVGSVGElement | null;
  scale?: number;
  fileName?: string;
}

export const WATERMARK_LINES = EXPORT_WATERMARK_LINES;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Graceful fallback for missing local or remote images
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 72;
      fallbackCanvas.height = 72;
      const fCtx = fallbackCanvas.getContext('2d');
      if (fCtx) {
        fCtx.fillStyle = '#10b981';
        fCtx.beginPath();
        fCtx.arc(36, 36, 32, 0, Math.PI * 2);
        fCtx.fill();
      }
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.src = fallbackCanvas.toDataURL();
    };
    img.src = src;
  });
}

function svgToImage(svg: SVGSVGElement): Promise<HTMLImageElement> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  // Strip interactive elements/overlays before snapshotting
  const interactives = clone.querySelectorAll(
    '[data-charm-item="true"], [data-shoe-interactive="true"]'
  );
  interactives.forEach((el) => el.remove());

  const svgXml = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number
): void {
  const footerY = height - 100 * scale;

  // Thin separator line
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(40 * scale, footerY);
  ctx.lineTo(width - 40 * scale, footerY);
  ctx.stroke();

  // Watermark text
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = `600 ${11 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(WATERMARK_LINES[0], width / 2, footerY + 28 * scale);

  ctx.fillStyle = 'rgba(167, 243, 208, 0.7)';
  ctx.font = `400 ${10 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(WATERMARK_LINES[1], width / 2, footerY + 48 * scale);

  ctx.fillStyle = 'rgba(110, 231, 183, 0.55)';
  ctx.font = `400 ${9.5 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(WATERMARK_LINES[2], width / 2, footerY + 66 * scale);
}

export async function exportShoeCanvasToPng({
  size,
  color,
  placements,
  leftSvg,
  rightSvg,
  scale = 2,
  fileName,
}: PngExportOptions): Promise<string> {
  const shoeW = SHOE_VIEWBOX.width;
  const shoeH = SHOE_VIEWBOX.height;
  const gap = 36;
  const pairWidth = shoeW * 2 + gap;

  const canvasWidth = (pairWidth + 160) * scale;
  const headerH = 130;
  const footerH = 130;
  const canvasHeight = (shoeH + headerH + footerH) * scale;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context for export');

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  bgGrad.addColorStop(0, '#041d15');
  bgGrad.addColorStop(0.5, '#031811');
  bgGrad.addColorStop(1, '#010e0a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Header Title & Badges
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('CROCS CUSTOMIZER', canvasWidth / 2, 48 * scale);

  ctx.fillStyle = '#34d399';
  ctx.font = `600 ${12 * scale}px system-ui, -apple-system, sans-serif`;
  const subtitle = `${color.name.toUpperCase()} CLASSIC CLOG • ${size.toUpperCase()} • ${placements.length} JIBBITZ™`;
  ctx.fillText(subtitle, canvasWidth / 2, 74 * scale);

  // Render Left & Right Shoe SVGs
  const shoeOriginY = headerH * scale;
  const leftShoeX = ((canvasWidth / scale - pairWidth) / 2) * scale;
  const rightShoeX = leftShoeX + (shoeW + gap) * scale;

  if (leftSvg) {
    const leftImg = await svgToImage(leftSvg);
    ctx.drawImage(leftImg, leftShoeX, shoeOriginY, shoeW * scale, shoeH * scale);
  }
  if (rightSvg) {
    const rightImg = await svgToImage(rightSvg);
    ctx.drawImage(rightImg, rightShoeX, shoeOriginY, shoeW * scale, shoeH * scale);
  }

  // Render Placed Jibbitz Charms
  const sizeHoles = SHOE_HOLES_BY_SIZE[size] ?? SHOE_HOLES_BY_SIZE.adult;
  const charmSize = 72 * scale;
  const halfCharm = charmSize / 2;

  for (const p of placements) {
    const isLeft = p.holeId.startsWith('HL');
    const holeIndex = parseInt(p.holeId.split('-')[1], 10);
    const holeCfg = sizeHoles.find((h) => h.index === holeIndex);
    if (!holeCfg) continue;

    const shoeOriginX = isLeft ? leftShoeX : rightShoeX;
    const holeX = isLeft ? holeCfg.x : SHOE_VIEWBOX.width - holeCfg.x;
    const canvasHoleX = shoeOriginX + holeX * scale;
    const canvasHoleY = shoeOriginY + holeCfg.y * scale;

    const imgUrl = p.charm?.imageUrl ?? `/catalog/images/${p.jibbitId}.png`;
    try {
      const charmImg = await loadImage(imgUrl);
      ctx.save();
      ctx.translate(canvasHoleX, canvasHoleY);
      ctx.rotate((p.rotationDeg * Math.PI) / 180);

      // Realistic charm drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 10 * scale;
      ctx.shadowOffsetY = 6 * scale;

      ctx.drawImage(charmImg, -halfCharm, -halfCharm, charmSize, charmSize);
      ctx.restore();
    } catch {
      // Continue drawing other charms
    }
  }

  // Render Watermark & Disclaimers
  drawWatermark(ctx, canvasWidth, canvasHeight, scale);

  const dataUrl = canvas.toDataURL('image/png');
  const safeName =
    fileName ??
    `crocs-custom-${color.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;

  const link = document.createElement('a');
  link.download = safeName;
  link.href = dataUrl;
  link.click();

  return dataUrl;
}
