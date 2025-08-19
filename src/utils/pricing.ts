import type { Product } from "../types/Product";

export function getBestUnitPrice(product: Product, quantity: number): number {
  if (!product.priceBreaks || product.priceBreaks.length === 0) {
    return product.basePrice;
  }

  const sortedBreaks = [...product.priceBreaks].sort(
    (a, b) => a.minQty - b.minQty
  );
  const applicableBreaks = sortedBreaks.filter((pb) => quantity >= pb.minQty);
  const best = applicableBreaks.reduce(
    (minPrice, pb) => Math.min(minPrice, pb.price),
    product.basePrice
  );
  return best;
}
