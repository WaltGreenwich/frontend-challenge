import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { products as allProducts } from "../data/products";
import { Product } from "../types/Product";
import "./ProductList.css";
import { useDebounce } from "../hooks/useDebounce";

const ProductList = () => {
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(allProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter and sort products based on criteria
  const filterProducts = (
    category: string,
    search: string,
    sort: string,
    supplier: string,
    minPrice: number | "",
    maxPrice: number | ""
  ) => {
    let filtered = [...allProducts];

    // Category filter
    if (category !== "all") {
      filtered = filtered.filter((product) => product.category === category);
    }

    // Supplier filter
    if (supplier && supplier !== "all") {
      filtered = filtered.filter((product) => product.supplier === supplier);
    }

    // Price range filter (based on basePrice)
    if (minPrice !== "") {
      filtered = filtered.filter(
        (product) => product.basePrice >= (minPrice as number)
      );
    }
    if (maxPrice !== "") {
      filtered = filtered.filter(
        (product) => product.basePrice <= (maxPrice as number)
      );
    }

    // Search filter
    if (search) {
      const normalizedQuery = search.trim().toLowerCase();
      filtered = filtered.filter((product) => {
        const name = product.name.toLowerCase();
        const sku = product.sku.toLowerCase();
        return name.includes(normalizedQuery) || sku.includes(normalizedQuery);
      });
    }

    // Sorting logic
    switch (sort) {
      case "name":
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price":
      case "price-asc":
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "stock":
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterProducts(
      category,
      searchQuery,
      sortBy,
      selectedSupplier,
      priceMin,
      priceMax
    );
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
  };

  // apply debounced search
  useMemo(() => {
    filterProducts(
      selectedCategory,
      debouncedSearch,
      sortBy,
      selectedSupplier,
      priceMin,
      priceMax
    );
  }, [
    selectedCategory,
    debouncedSearch,
    sortBy,
    selectedSupplier,
    priceMin,
    priceMax,
  ]);

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    filterProducts(
      selectedCategory,
      searchQuery,
      sort,
      selectedSupplier,
      priceMin,
      priceMax
    );
  };

  const handleSupplierChange = (supplierId: string) => {
    setSelectedSupplier(supplierId);
    filterProducts(
      selectedCategory,
      searchQuery,
      sortBy,
      supplierId,
      priceMin,
      priceMax
    );
  };

  const handlePriceChange = (min: number | "", max: number | "") => {
    setPriceMin(min);
    setPriceMax(max);
    filterProducts(
      selectedCategory,
      searchQuery,
      sortBy,
      selectedSupplier,
      min,
      max
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedSupplier("all");
    setSearchQuery("");
    setSortBy("name");
    setPriceMin("");
    setPriceMax("");
    filterProducts("all", "", "name", "all", "", "");
  };

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-info">
            <h1 className="page-title h2">Catálogo de Productos</h1>
            <p className="page-subtitle p1">
              Descubre nuestra selección de productos promocionales premium
            </p>
          </div>

          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-value p1-medium">
                {filteredProducts.length}
              </span>
              <span className="stat-label l1">productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value p1-medium">6</span>
              <span className="stat-label l1">categorías</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          selectedSupplier={selectedSupplier}
          priceMin={priceMin}
          priceMax={priceMax}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onSupplierChange={handleSupplierChange}
          onPriceChange={handlePriceChange}
          onClearFilters={handleClearFilters}
        />

        {/* Products Grid */}
        <div className="products-section">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3 className="h2">No hay productos</h3>
              <p className="p1">
                No se encontraron productos que coincidan con tu búsqueda.
              </p>
              <button
                className="btn btn-primary cta1"
                onClick={() => {
                  handleClearFilters();
                }}
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
