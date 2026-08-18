import { useEffect, useRef } from 'react';
import Clog from '../../../public/shoe/clog.png';

export type GradientConfig = {
  colors: string[];
  angle?: number; // In degrees (e.g., 0 = bottom-to-top, 90 = left-to-right, 180 = top-to-bottom)
  type?: 'linear' | 'radial';
};

export type ColorProp = string | string[] | GradientConfig;

interface ColoredClogProps {
  color: ColorProp;
  flipped?: boolean;
}

export default function Canvas({
  color,
  flipped = false,
}: ColoredClogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      // 1. Render original image to get raw pixel data
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 2. Generate a binary mask of enclosed interior areas
      const maskData = createEnclosedMask(
        imageData.data,
        canvas.width,
        canvas.height
      );

      // 3. Create an offscreen canvas for gradient compositing
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) return;

      // Draw the enclosed mask onto offscreen canvas
      maskCtx.putImageData(maskData, 0, 0);

      // Clip the gradient directly inside the enclosed mask shape
      maskCtx.globalCompositeOperation = 'source-in';
      maskCtx.fillStyle = createGradient(
        maskCtx,
        canvas.width,
        canvas.height,
        color
      );
      maskCtx.fillRect(0, 0, canvas.width, canvas.height);

      // 4. Render final composite on main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(maskCanvas, 0, 0); // Render gradient fill
      ctx.drawImage(image, 0, 0);      // Overlay sharp line art on top
    };

    image.src = typeof Clog === 'string' ? Clog : (Clog as { src: string }).src;
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full max-w-md ${
        flipped ? 'scale-x-[-1]' : ''
      }`}
    />
  );
}

// Generates an alpha mask for all enclosed interior regions
function createEnclosedMask(
  pixels: Uint8ClampedArray,
  width: number,
  height: number
): ImageData {
  const totalPixels = width * height;
  const visited = new Uint8Array(totalPixels);
  const stack: number[] = [];

  // Seed exterior borders
  for (let x = 0; x < width; x++) {
    const topIdx = x;
    if (pixels[topIdx * 4 + 3] === 0) {
      visited[topIdx] = 1;
      stack.push(topIdx);
    }
    const bottomIdx = (height - 1) * width + x;
    if (pixels[bottomIdx * 4 + 3] === 0 && !visited[bottomIdx]) {
      visited[bottomIdx] = 1;
      stack.push(bottomIdx);
    }
  }

  for (let y = 0; y < height; y++) {
    const leftIdx = y * width;
    if (pixels[leftIdx * 4 + 3] === 0 && !visited[leftIdx]) {
      visited[leftIdx] = 1;
      stack.push(leftIdx);
    }
    const rightIdx = y * width + (width - 1);
    if (pixels[rightIdx * 4 + 3] === 0 && !visited[rightIdx]) {
      visited[rightIdx] = 1;
      stack.push(rightIdx);
    }
  }

  // Flood fill exterior transparent pixels
  while (stack.length > 0) {
    const idx = stack.pop()!;
    const x = idx % width;
    const y = Math.floor(idx / width);

    if (x > 0) checkNeighbor(idx - 1);
    if (x < width - 1) checkNeighbor(idx + 1);
    if (y > 0) checkNeighbor(idx - width);
    if (y < height - 1) checkNeighbor(idx + width);
  }

  function checkNeighbor(nIdx: number) {
    if (!visited[nIdx] && pixels[nIdx * 4 + 3] === 0) {
      visited[nIdx] = 1;
      stack.push(nIdx);
    }
  }

  // Create mask where enclosed pixels are solid white and others are transparent
  const mask = new ImageData(width, height);
  const maskPixels = mask.data;

  for (let i = 0; i < totalPixels; i++) {
    const pixelIdx = i * 4;
    if (pixels[pixelIdx + 3] === 0 && visited[i] === 0) {
      maskPixels[pixelIdx] = 255;
      maskPixels[pixelIdx + 1] = 255;
      maskPixels[pixelIdx + 2] = 255;
      maskPixels[pixelIdx + 3] = 255;
    }
  }

  return mask;
}

// Converts color props into CanvasGradient or solid fill styles
function createGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: ColorProp
): CanvasGradient | string {
  if (typeof color === 'string') {
    return color;
  }

  const config: GradientConfig = Array.isArray(color)
    ? { colors: color, angle: 180, type: 'linear' }
    : { angle: 180, type: 'linear', ...color };

  const { colors, angle = 180, type = 'linear' } = config;

  if (colors.length === 1) return colors[0];

  if (type === 'radial') {
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.max(width, height) / 2;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    colors.forEach((c, idx) => grad.addColorStop(idx / (colors.length - 1), c));
    return grad;
  }

  // Calculate angled linear gradient vector
  const rad = ((angle - 90) * Math.PI) / 180;
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.sqrt(width * width + height * height) / 2;

  const x0 = cx - Math.cos(rad) * r;
  const y0 = cy - Math.sin(rad) * r;
  const x1 = cx + Math.cos(rad) * r;
  const y1 = cy + Math.sin(rad) * r;

  const grad = ctx.createLinearGradient(x0, y0, x1, y1);
  colors.forEach((c, idx) => grad.addColorStop(idx / (colors.length - 1), c));
  return grad;
}