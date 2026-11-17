import { UploadedImage } from "@/types/global";

export type Product = {
  _id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  cost: number;
  price: number;
  priceAfterDiscount: number | null;
  isDeleted: boolean;
  isAvailable: boolean;
  totalSold: number;
  season: Season;
  category: string;
  subcategory: string;
  colors: ProductColor[];
  variants: Variant[];
  /** Normalized (trimmed, deduped, non-empty) by the backend - see productValidator.js. Synced to Shopify as-is. */
  tags: string[];
  ratingsQuantity?: number;
  ratingsAverage?: number;
  createdAt: Date;
  updatedAt: Date;
  /** Real Shopify integration mapping state (see mapping.service.js#classifySyncStatus on the
   * backend) - only present on responses that attach it (the admin Products list), absent
   * elsewhere (e.g. the public storefront). Never derive this on the frontend. */
  shopifySync?: "synced" | "unsynced" | "failed";
  /** The mapped Shopify product's id, or null when unsynced - see mapping.service.js#getSyncDetailsForProducts.
   * Present alongside `shopifySync` on the same responses. */
  shopifyProductId?: string | null;
  /** When the mapping was last successfully synced, or null when unsynced/never synced. */
  shopifySyncedAt?: Date | null;
};

// ============================================================================

export type Season = "summer" | "winter" | "all";

// Free text - not restricted to a predefined list. The color picker lets an admin type/name any
// color, not just pick one from a fixed set (see colors-information.tsx) - the backend's
// colorSchema.name validator was loosened to match (see productModel.js). colors.ts's
// colorsArray/getColorLabel still exist for translating the older predefined names (and any
// matching custom name) for display, with a graceful fallback to the raw string otherwise.
export type Color = string;

export type ProductColor = {
  name: Color;
  code: string;
  images: UploadedImage[];
};

// ============================================================================

export type Variant = {
  _id: string;
  color: Color;
  size: string;
  variantCode: string;
  stock: { warehouse: string; quantity: number }[];
  isDeleted: boolean;
};
