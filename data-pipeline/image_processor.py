"""
Image processing utilities for Crocs Jibbitz charms:
- Detects solid/studio white backgrounds
- Removes background via rembg (u2net) with solid white matting
- Tightly outlines the object and cuts out all excess white background/margins
- Normalizes dimensions and calculates aspect ratio
"""

from typing import Tuple
import numpy as np
from PIL import Image

def has_white_background(img: Image.Image) -> bool:
    """Checks if image contains solid or studio white background pixels."""
    rgba = img.convert("RGBA")
    arr = np.array(rgba)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]
    white_mask = (rgb[:, :, 0] > 235) & (rgb[:, :, 1] > 235) & (rgb[:, :, 2] > 235) & (alpha > 30)
    return bool(np.sum(white_mask) > 100)

def analyze_alpha_transparency(img: Image.Image) -> bool:
    """
    Checks if an image already has a genuine transparent background with no white studio matte.
    """
    rgba = img.convert("RGBA")
    if has_white_background(rgba):
        return False

    alpha = np.array(rgba.split()[-1])
    h, w = alpha.shape
    top = alpha[0, :] == 0
    bottom = alpha[h - 1, :] == 0
    left = alpha[:, 0] == 0
    right = alpha[:, w - 1] == 0

    perimeter_zeros = np.sum(top) + np.sum(bottom) + np.sum(left) + np.sum(right)
    total_perimeter = 2 * w + 2 * h
    return (perimeter_zeros / float(total_perimeter)) > 0.85

def remove_background_if_needed(img: Image.Image) -> Image.Image:
    """
    Removes solid or studio background using rembg.
    Composites over solid white first to give rembg sharp contour boundaries.
    """
    if analyze_alpha_transparency(img):
        return img.convert("RGBA")

    from rembg import remove, new_session
    raw = img.convert("RGBA")
    # Composite onto pure white canvas so rembg detects object silhouette cleanly
    canvas = Image.new("RGBA", raw.size, (255, 255, 255, 255))
    canvas.paste(raw, mask=raw.split()[3])
    rgb_img = canvas.convert("RGB")

    session = new_session("u2net")
    return remove(rgb_img, session=session).convert("RGBA")

def trim_transparent_padding(img: Image.Image, padding_px: int = 2) -> Image.Image:
    """
    Tightly outlines the object and cuts out all transparent and white margins.
    Uses an alpha threshold of 35 to reject faint shadow haze and compression artifacts.
    """
    rgba = img.convert("RGBA")
    arr = np.array(rgba)
    alpha = arr[:, :, 3]

    y_indices, x_indices = np.where(alpha > 35)
    if len(y_indices) == 0:
        return rgba

    min_x = max(0, int(np.min(x_indices)) - padding_px)
    max_x = min(rgba.width, int(np.max(x_indices)) + padding_px + 1)
    min_y = max(0, int(np.min(y_indices)) - padding_px)
    max_y = min(rgba.height, int(np.max(y_indices)) + padding_px + 1)

    return rgba.crop((min_x, min_y, max_x, max_y))

def normalize_charm_asset(
    img: Image.Image,
    target_max_size: int = 256
) -> Tuple[Image.Image, float, Tuple[int, int]]:
    """
    Prepares a clean Jibbitz PNG asset:
    1. Removes studio/white background
    2. Tightly crops to the charm object outline
    3. Resizes to normalized display bounds (preserving aspect ratio)
    Returns: (processed_image, aspect_ratio, (width, height))
    """
    cleaned = remove_background_if_needed(img)
    trimmed = trim_transparent_padding(cleaned, padding_px=2)

    w, h = trimmed.size
    aspect_ratio = round(w / float(h), 3) if h > 0 else 1.0

    if max(w, h) > target_max_size:
        scale = target_max_size / float(max(w, h))
        new_w = max(1, int(round(w * scale)))
        new_h = max(1, int(round(h * scale)))
        resized = trimmed.resize((new_w, new_h), Image.Resampling.LANCZOS)
    else:
        resized = trimmed

    return resized, aspect_ratio, resized.size
