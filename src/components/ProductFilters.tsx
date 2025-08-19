import { categories, suppliers } from "../data/products";
import "./ProductFilters.css";

interface ProductFiltersProps {
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;
  selectedSupplier: string;
  priceMin: number | "";
  priceMax: number | "";
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
  onSupplierChange: (supplierId: string) => void;
  onPriceChange: (min: number | "", max: number | "") => void;
  onClearFilters: () => void;
}

const ProductFilters = ({
  selectedCategory,
  searchQuery,
  sortBy,
  selectedSupplier,
  priceMin,
  priceMax,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onSupplierChange,
  onPriceChange,
  onClearFilters,
}: ProductFiltersProps) => {
  return (
    <div className="product-filters">
      <div className="filters-card">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Buscar productos, SKU..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input p1"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => onSearchChange("")}
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Categorías</h3>
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="material-icons">{category.icon}</span>
                <span className="category-name l1">{category.name}</span>
                <span className="category-count l1">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Ordenar por</h3>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select p1"
          >
            <option value="name">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
            <option value="price-asc">Menor Precio</option>
            <option value="price-desc">Mayor Precio</option>
            <option value="stock">Stock disponible</option>
          </select>
        </div>

        {/* Supplier Filter */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Proveedor</h3>
          <select
            value={selectedSupplier}
            onChange={(e) => onSupplierChange(e.target.value)}
            className="sort-select p1"
          >
            <option value="all">Todos</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Rango de precios</h3>
          <div className="price-range">
            <input
              type="number"
              placeholder="Mín"
              value={priceMin}
              onChange={(e) =>
                onPriceChange(
                  e.target.value ? parseInt(e.target.value) : "",
                  priceMax
                )
              }
              className="search-input p1"
              min={0}
            />
            <span className="l1" style={{ padding: "0 8px" }}>
              -
            </span>
            <input
              type="number"
              placeholder="Máx"
              value={priceMax}
              onChange={(e) =>
                onPriceChange(
                  priceMin,
                  e.target.value ? parseInt(e.target.value) : ""
                )
              }
              className="search-input p1"
              min={0}
            />
          </div>
        </div>

        {/* Clear Filters */}
        <div className="filter-section">
          <button className="btn btn-secondary l1" onClick={onClearFilters}>
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
