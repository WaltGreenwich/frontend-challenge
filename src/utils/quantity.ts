import type { Product } from "../types/Product";

export function getQuantityBounds(product: Product): {
  min: number;
  max: number;
} {
  const min = product.minQuantity ?? 1;
  const max =
    product.maxQuantity !== undefined
      ? product.maxQuantity
      : product.stock !== undefined
      ? product.stock
      : 10000;
  return { min, max };
}

export function clampQuantity(product: Product, quantity: number): number {
  const { min, max } = getQuantityBounds(product);
  if (Number.isNaN(quantity)) return min;
  return Math.max(min, Math.min(max, quantity));
}
