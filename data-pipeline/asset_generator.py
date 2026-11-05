"""
Generates clean, realistic vector-styled RGBA seed images for the 24 initial charms.
Includes distinctive silhouettes, highlights, and transparent backgrounds.
"""

from PIL import Image, ImageDraw
from typing import Dict, Any

def render_seed_charm_image(item: Dict[str, Any], size: int = 128) -> Image.Image:
    """Renders a clean transparent PNG for a seed charm."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    color = item.get("color", "#F59E0B")
    category = item.get("category", "characters")
    name = item.get("name", "")

    # Base shape dimensions with safe margins
    pad = 16
    x0, y0 = pad, pad
    x1, y1 = size - pad, size - pad

    # Draw category-specific charm stylized geometries
    if "Star" in name:
        points = [
            (64, 18), (76, 48), (108, 52), (84, 74), (91, 106),
            (64, 90), (37, 106), (44, 74), (20, 52), (52, 48)
        ]
        draw.polygon(points, fill=color, outline="#713F12", width=3)
        draw.ellipse([50, 52, 56, 68], fill="#111111")
        draw.ellipse([72, 52, 78, 68], fill="#111111")
    elif "Heart" in name:
        draw.pieslice([20, 24, 72, 76], 180, 0, fill=color)
        draw.pieslice([56, 24, 108, 76], 180, 0, fill=color)
        draw.polygon([(20, 50), (108, 50), (64, 108)], fill=color)
        draw.line([(20, 50), (64, 108), (108, 50)], fill="#881337", width=3)
    elif "Soccer" in name or "Basketball" in name:
        draw.ellipse([x0, y0, x1, y1], fill=color, outline="#1E293B", width=3)
        if "Soccer" in name:
            draw.polygon([(64, 50), (76, 58), (72, 72), (56, 72), (52, 58)], fill="#0F172A")
        else:
            draw.line([(64, y0), (64, y1)], fill="#1E293B", width=2)
            draw.line([(x0, 64), (x1, 64)], fill="#1E293B", width=2)
    elif "Lightning" in name:
        points = [(70, 16), (36, 68), (62, 68), (54, 112), (94, 56), (68, 56)]
        draw.polygon(points, fill=color, outline="#854D0E", width=3)
    elif "Donut" in name:
        draw.ellipse([x0, y0, x1, y1], fill="#FBBF24", outline="#78350F", width=3)
        draw.ellipse([x0 + 6, y0 + 6, x1 - 6, y1 - 6], fill=color)
        draw.ellipse([50, 50, 78, 78], fill=(0, 0, 0, 0), outline="#78350F", width=3)
        # Sprinkles
        draw.rectangle([40, 36, 46, 40], fill="#38BDF8")
        draw.rectangle([80, 38, 86, 42], fill="#FACC15")
        draw.rectangle([34, 72, 40, 76], fill="#4ADE80")
        draw.rectangle([86, 74, 92, 78], fill="#A855F7")
    elif "Letter" in name or "Number" in name:
        draw.rounded_rectangle([x0, y0, x1, y1], radius=16, fill=color, outline="#0F172A", width=3)
        char = "A" if "Letter" in name else "7"
        draw.text((54, 44), char, fill="#FFFFFF")
    else:
        # Default cute pill badge with charm border
        draw.rounded_rectangle([x0, y0, x1, y1], radius=24, fill=color, outline="#1E293B", width=3)
        draw.ellipse([40, 48, 50, 58], fill="#0F172A")
        draw.ellipse([78, 48, 88, 58], fill="#0F172A")
        draw.arc([52, 64, 76, 80], 0, 180, fill="#0F172A", width=3)

    return img
