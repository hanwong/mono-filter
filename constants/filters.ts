/**
 * Filter system with diverse sub-filters per category.
 * Each category contains unique, carefully crafted filters
 * inspired by real film stocks and popular photo editing presets.
 *
 * ColorMatrix is a 5x4 (20-value) matrix:
 * [R_r, R_g, R_b, R_a, R_offset,
 *  G_r, G_g, G_b, G_a, G_offset,
 *  B_r, B_g, B_b, B_a, B_offset,
 *  A_r, A_g, A_b, A_a, A_offset]
 */

// Identity matrix (no effect)
export const IDENTITY = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
];

export interface FilterVariant {
  /** Short display name, e.g. "Tri-X" */
  name: string;
  /** ColorMatrix values */
  matrix: number[];
}

export interface FilterGroup {
  /** Category name shown in top chips */
  category: string;
  /** Sub-filter variants */
  variants: FilterVariant[];
}

// ──────────────────────────────────────────────────────────
//  MONO — Black & White film simulations
// ──────────────────────────────────────────────────────────
const MONO: FilterGroup = {
  category: "Mono",
  variants: [
    {
      // Kodak Tri-X 400: High contrast, punchy, deep blacks
      name: "Tri-X",
      matrix: [
        0.35, 0.75, 0.1, 0, -0.18, 0.35, 0.75, 0.1, 0, -0.18, 0.35, 0.75, 0.1,
        0, -0.18, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Ilford HP5: Balanced, wider tonal range, softer
      name: "HP5",
      matrix: [
        0.25, 0.7, 0.1, 0, -0.05, 0.25, 0.7, 0.1, 0, -0.05, 0.25, 0.7, 0.1, 0,
        -0.05, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Kodak T-Max 100: Fine grain, high detail, smooth gradation
      name: "T-Max",
      matrix: [
        0.22, 0.72, 0.08, 0, -0.02, 0.22, 0.72, 0.08, 0, -0.02, 0.22, 0.72,
        0.08, 0, -0.02, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Ilford Delta 3200: Gritty, contrasty, dramatic
      name: "Delta",
      matrix: [
        0.4, 0.7, 0.1, 0, -0.25, 0.4, 0.7, 0.1, 0, -0.25, 0.4, 0.7, 0.1, 0,
        -0.25, 0, 0, 0, 1, 0,
      ],
    },
    {
      // High Key: Bright, airy, lifted shadows
      name: "Hi-Key",
      matrix: [
        0.21, 0.72, 0.07, 0, 0.15, 0.21, 0.72, 0.07, 0, 0.15, 0.21, 0.72, 0.07,
        0, 0.15, 0, 0, 0, 1, 0,
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────
//  GOLDEN — Warm golden tones
// ──────────────────────────────────────────────────────────
const GOLDEN: FilterGroup = {
  category: "Golden",
  variants: [
    {
      // Honey: Soft, gentle warmth
      name: "Honey",
      matrix: [
        1.08, 0.04, 0, 0, 0.05, 0, 1.03, 0, 0, 0.03, 0, 0, 0.92, 0, 0, 0, 0, 0,
        1, 0,
      ],
    },
    {
      // Amber: Deeper warm amber tones
      name: "Amber",
      matrix: [
        1.15, 0.08, 0, 0, 0.1, 0, 1.06, 0.02, 0, 0.05, 0, 0, 0.85, 0, -0.02, 0,
        0, 0, 1, 0,
      ],
    },
    {
      // Sunset: Orange-warm with slight magenta
      name: "Sunset",
      matrix: [
        1.2, 0.1, 0, 0, 0.08, 0, 1.0, 0, 0, 0.02, 0, 0, 0.82, 0, 0, 0, 0, 0, 1,
        0,
      ],
    },
    {
      // Caramel: Rich brownish warmth
      name: "Caramel",
      matrix: [
        1.12, 0.1, 0.05, 0, 0.06, 0.05, 1.02, 0.02, 0, 0.04, 0, 0, 0.88, 0,
        -0.03, 0, 0, 0, 1, 0,
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────
//  FADE — Faded, lifted, matte looks
// ──────────────────────────────────────────────────────────
const FADE: FilterGroup = {
  category: "Fade",
  variants: [
    {
      // Mist: Very light fade, dreamy
      name: "Mist",
      matrix: [
        1.0, 0.03, 0.03, 0, 0.1, 0.03, 1.0, 0.03, 0, 0.1, 0.03, 0.03, 1.0, 0,
        0.1, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Haze: Warm fade with lifted blacks
      name: "Haze",
      matrix: [
        0.95, 0.05, 0.02, 0, 0.12, 0.02, 0.95, 0.05, 0, 0.1, 0.02, 0.03, 0.92,
        0, 0.08, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Pastel: Desaturated + lifted, candy-like
      name: "Pastel",
      matrix: [
        0.9, 0.1, 0.05, 0, 0.12, 0.08, 0.88, 0.08, 0, 0.12, 0.05, 0.08, 0.9, 0,
        0.12, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Dream: Cool-toned fade, ethereal
      name: "Dream",
      matrix: [
        0.92, 0.05, 0.05, 0, 0.08, 0.05, 0.95, 0.05, 0, 0.1, 0.05, 0.05, 1.02,
        0, 0.12, 0, 0, 0, 1, 0,
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────
//  VINTAGE — Retro film emulations
// ──────────────────────────────────────────────────────────
const VINTAGE: FilterGroup = {
  category: "Vintage",
  variants: [
    {
      // Kodachrome: Saturated, rich reds, deep contrast
      name: "K-chrome",
      matrix: [
        1.2, 0.1, 0, 0, 0.02, 0, 1.05, 0.05, 0, -0.02, 0, 0, 0.85, 0, -0.05, 0,
        0, 0, 1, 0,
      ],
    },
    {
      // Polaroid: Washed out, warm, slight green tint in shadows
      name: "Polaroid",
      matrix: [
        1.05, 0.1, 0.05, 0, 0.05, 0.05, 1.02, 0.05, 0, 0.08, 0.02, 0.08, 0.9, 0,
        0.05, 0, 0, 0, 1, 0,
      ],
    },
    {
      // 70s: Yellow-green cast, warm shadows
      name: "70s",
      matrix: [
        1.0, 0.15, 0.05, 0, 0.04, 0.05, 1.05, 0.08, 0, 0.06, 0, 0.05, 0.75, 0,
        -0.02, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Retro: Cross-processed look, teal shadows + warm highlights
      name: "Retro",
      matrix: [
        1.1, 0.12, 0, 0, 0.02, -0.05, 1.0, 0.1, 0, 0.05, 0, 0.05, 0.85, 0, 0.08,
        0, 0, 0, 1, 0,
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────
//  MOODY — Dark, dramatic tones
// ──────────────────────────────────────────────────────────
const MOODY: FilterGroup = {
  category: "Moody",
  variants: [
    {
      // Shadow: Crushed blacks, low key
      name: "Shadow",
      matrix: [
        0.9, 0.08, 0, 0, -0.1, 0, 0.85, 0.08, 0, -0.1, 0, 0.05, 0.9, 0, -0.08,
        0, 0, 0, 1, 0,
      ],
    },
    {
      // Storm: Blue-dark, cold moody
      name: "Storm",
      matrix: [
        0.85, 0.05, 0, 0, -0.08, 0, 0.88, 0.08, 0, -0.04, 0.05, 0.08, 1.0, 0,
        -0.02, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Ember: Dark with warm undertones
      name: "Ember",
      matrix: [
        0.95, 0.1, 0, 0, -0.04, 0, 0.82, 0.05, 0, -0.08, 0, 0, 0.8, 0, -0.1, 0,
        0, 0, 1, 0,
      ],
    },
    {
      // Midnight: Deep blue-black tones
      name: "Midnight",
      matrix: [
        0.8, 0.05, 0, 0, -0.12, 0, 0.82, 0.05, 0, -0.08, 0.05, 0.1, 0.95, 0,
        -0.03, 0, 0, 0, 1, 0,
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────
//  SEPIA — Classic warm tinting
// ──────────────────────────────────────────────────────────
const SEPIA: FilterGroup = {
  category: "Sepia",
  variants: [
    {
      // Classic: Traditional photo sepia
      name: "Classic",
      matrix: [
        0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534,
        0.131, 0, 0, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Warm Sepia: More orange/warm shift
      name: "Warm",
      matrix: [
        0.45, 0.75, 0.15, 0, 0.05, 0.35, 0.65, 0.15, 0, 0.02, 0.2, 0.45, 0.12,
        0, -0.03, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Antique: Very old daguerreotype look
      name: "Antique",
      matrix: [
        0.5, 0.6, 0.15, 0, -0.05, 0.4, 0.55, 0.12, 0, -0.05, 0.3, 0.4, 0.1, 0,
        -0.05, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Copper: Reddish-brown metallic tone
      name: "Copper",
      matrix: [
        0.5, 0.7, 0.15, 0, 0.04, 0.3, 0.6, 0.13, 0, -0.02, 0.2, 0.4, 0.1, 0,
        -0.06, 0, 0, 0, 1, 0,
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────
//  NOIR — High contrast monochrome
// ──────────────────────────────────────────────────────────
const NOIR: FilterGroup = {
  category: "Noir",
  variants: [
    {
      // Film Noir: Classic hard shadow B&W
      name: "Classic",
      matrix: [
        0.3, 0.8, 0.1, 0, -0.15, 0.3, 0.8, 0.1, 0, -0.15, 0.3, 0.8, 0.1, 0,
        -0.15, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Silver: Bright metallic B&W with contrast
      name: "Silver",
      matrix: [
        0.35, 0.7, 0.15, 0, -0.08, 0.35, 0.7, 0.15, 0, -0.08, 0.35, 0.7, 0.15,
        0, -0.08, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Ink: Ultra-high contrast, almost graphic
      name: "Ink",
      matrix: [
        0.45, 0.9, 0.12, 0, -0.35, 0.45, 0.9, 0.12, 0, -0.35, 0.45, 0.9, 0.12,
        0, -0.35, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Charcoal: Slight warm tone in shadows
      name: "Charcoal",
      matrix: [
        0.32, 0.78, 0.12, 0, -0.1, 0.3, 0.76, 0.11, 0, -0.12, 0.27, 0.72, 0.1,
        0, -0.14, 0, 0, 0, 1, 0,
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────
//  CREAM — Soft warm pastels
// ──────────────────────────────────────────────────────────
const CREAM: FilterGroup = {
  category: "Cream",
  variants: [
    {
      // Vanilla: Light, warm, airy
      name: "Vanilla",
      matrix: [
        1.05, 0.04, 0, 0, 0.04, 0, 1.02, 0.02, 0, 0.03, 0, 0, 0.95, 0, 0.02, 0,
        0, 0, 1, 0,
      ],
    },
    {
      // Latte: Warm brown tones, coffee feel
      name: "Latte",
      matrix: [
        1.08, 0.06, 0.03, 0, 0.05, 0.02, 1.0, 0.03, 0, 0.04, 0, 0, 0.9, 0, 0.01,
        0, 0, 0, 1, 0,
      ],
    },
    {
      // Porcelain: Clean, bright, even skin tones
      name: "Porcelain",
      matrix: [
        1.03, 0.02, 0.02, 0, 0.06, 0.02, 1.03, 0.02, 0, 0.06, 0.02, 0.02, 1.0,
        0, 0.04, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Portra: Kodak Portra style — natural, warm, soft contrast
      name: "Portra",
      matrix: [
        1.06, 0.04, 0, 0, 0.02, 0, 1.04, 0.02, 0, 0.01, 0, 0.02, 0.96, 0, 0.03,
        0, 0, 0, 1, 0,
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────
//  FROST — Cool blue tones
// ──────────────────────────────────────────────────────────
const FROST: FilterGroup = {
  category: "Frost",
  variants: [
    {
      // Ice: Light cool blue
      name: "Ice",
      matrix: [
        0.93, 0, 0.05, 0, 0, 0, 0.98, 0.05, 0, 0.02, 0.05, 0.05, 1.1, 0, 0.04,
        0, 0, 0, 1, 0,
      ],
    },
    {
      // Arctic: Stronger blue shift, desaturated
      name: "Arctic",
      matrix: [
        0.88, 0.03, 0.05, 0, -0.02, 0, 0.95, 0.08, 0, 0.02, 0.08, 0.08, 1.15, 0,
        0.06, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Winter: Blue-grey, muted
      name: "Winter",
      matrix: [
        0.9, 0.05, 0.05, 0, 0, 0.03, 0.92, 0.05, 0, 0.02, 0.05, 0.05, 1.05, 0,
        0.05, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Aqua: Teal/cyan accent
      name: "Aqua",
      matrix: [
        0.85, 0, 0.05, 0, -0.02, 0.02, 1.02, 0.08, 0, 0.04, 0.05, 0.1, 1.08, 0,
        0.03, 0, 0, 0, 1, 0,
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────
//  BLUSH — Pink / warm-highlight tones
// ──────────────────────────────────────────────────────────
const BLUSH: FilterGroup = {
  category: "Blush",
  variants: [
    {
      // Rose: Subtle pink, feminine
      name: "Rose",
      matrix: [
        1.06, 0.04, 0.02, 0, 0.03, 0, 0.97, 0.02, 0, 0, 0.02, 0, 1.0, 0, 0.02,
        0, 0, 0, 1, 0,
      ],
    },
    {
      // Peach: Warm pink-orange
      name: "Peach",
      matrix: [
        1.1, 0.06, 0, 0, 0.03, 0, 0.98, 0.02, 0, 0.02, 0, 0, 0.95, 0, 0.02, 0,
        0, 0, 1, 0,
      ],
    },
    {
      // Coral: Deeper pink-red tones
      name: "Coral",
      matrix: [
        1.12, 0.08, 0, 0, 0.04, 0, 0.95, 0.02, 0, 0, 0.02, 0, 0.95, 0, 0.03, 0,
        0, 0, 1, 0,
      ],
    },
    {
      // Sakura: Japanese cherry blossom soft pink
      name: "Sakura",
      matrix: [
        1.05, 0.06, 0.04, 0, 0.05, 0.02, 0.98, 0.04, 0, 0.04, 0.04, 0.02, 1.02,
        0, 0.05, 0, 0, 0, 1, 0,
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────
//  ASH — Desaturated, muted tones
// ──────────────────────────────────────────────────────────
const ASH: FilterGroup = {
  category: "Ash",
  variants: [
    {
      // Slate: Cool desaturated
      name: "Slate",
      matrix: [
        0.85, 0.12, 0.05, 0, 0.02, 0.08, 0.82, 0.08, 0, 0.02, 0.08, 0.1, 0.82,
        0, 0.02, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Concrete: Flat, washed, urban
      name: "Concrete",
      matrix: [
        0.88, 0.1, 0.05, 0, 0.05, 0.08, 0.85, 0.06, 0, 0.05, 0.06, 0.08, 0.85,
        0, 0.05, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Dust: Warm desaturated, dusty film
      name: "Dust",
      matrix: [
        0.9, 0.12, 0.05, 0, 0.04, 0.08, 0.84, 0.06, 0, 0.03, 0.05, 0.06, 0.78,
        0, 0.02, 0, 0, 0, 1, 0,
      ],
    },
    {
      // Smoke: Cool grey desaturation
      name: "Smoke",
      matrix: [
        0.82, 0.15, 0.08, 0, 0.02, 0.1, 0.8, 0.1, 0, 0.03, 0.1, 0.12, 0.82, 0,
        0.04, 0, 0, 0, 1, 0,
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────
//  Exports
// ──────────────────────────────────────────────────────────

/** Ordered list of all filter groups */
export const FILTER_GROUPS: FilterGroup[] = [
  MONO,
  GOLDEN,
  FADE,
  VINTAGE,
  MOODY,
  SEPIA,
  NOIR,
  CREAM,
  FROST,
  BLUSH,
  ASH,
];

/** Category names in order (for chips) */
export const FILTER_NAMES = ["None", ...FILTER_GROUPS.map((g) => g.category)];

/** Lookup helper: get a FilterGroup by category name */
export function getFilterGroup(category: string): FilterGroup | undefined {
  return FILTER_GROUPS.find((g) => g.category === category);
}
