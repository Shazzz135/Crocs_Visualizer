"""
Catalog filtering rules for Crocs Jibbitz ingestion pipeline.
Ensures every charm is an authentic, individual, flat PVC Jibbitz.
Filters out multi-packs, 3-packs, 5-packs, bundles, boxed sets,
and bulky 3D silicone/puffer/shaker objects.
"""

import re

MULTIPACK_PATTERN = re.compile(
    r"\b(pack|set|bundle|multipack|\d+\s*p(?:ac)?k|\d+-pack|advent|calendar|backpack|bag|clog|shoe|sandal|pouch|tote|box|blind\s*box)\b",
    re.IGNORECASE,
)

THREE_D_PATTERN = re.compile(
    r"\b(3d|3-d|squish|plush|puffer|shaker|spinner)\b",
    re.IGNORECASE,
)

def is_individual_charm(name: str, description: str = "") -> bool:
    """
    Ensures charm is an authentic standalone individual flat Jibbitz.
    Filters out 3-packs, 5-packs, bundles, boxed sets, and 3D objects.
    """
    text = f"{name} {description}".lower()
    if MULTIPACK_PATTERN.search(text) or THREE_D_PATTERN.search(text):
        return False
    return True
