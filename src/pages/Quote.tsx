import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";
import type { Product } from "../types/Product";
import { formatCLP } from "../utils/currency";
import { clampQuantity, getQuantityBounds } from "../utils/quantity";
import { getBestUnitPrice } from "../utils/pricing";

const Quote = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  // Quote form state
  const [companyName, setCompanyName] = useState("");
  const [companyRut, setCompanyRut] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (id) {
      const found = products.find((p) => p.id === parseInt(id)) || null;
      setProduct(found);
    }
  }, [id]);

  const { min: minQty, max: maxQty } = useMemo(() => {
    return product ? getQuantityBounds(product) : { min: 1, max: 10000 };
  }, [product]);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    return getBestUnitPrice(product, quantity);
  }, [product, quantity]);

  const total = useMemo(() => unitPrice * quantity, [unitPrice, quantity]);

  if (!product) {
    return (
      <div className="container">
        <div className="product-not-found">
          <span className="material-icons">error_outline</span>
          <h2 className="h2">Producto no encontrado</h2>
          <p className="p1">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <Link to="/" className="btn btn-primary cta1">
            <span className="material-icons">arrow_back</span>
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const quoteText = `Cotización SWAG\n\nProducto: ${product.name} (SKU: ${
    product.sku
  })\nCantidad: ${quantity}\nPrecio unitario: ${formatCLP(
    unitPrice,
    "code"
  )}\nTotal: ${formatCLP(
    total,
    "code"
  )}\n\nEmpresa: ${companyName}\nRUT: ${companyRut}\nContacto: ${contactName}\nEmail: ${email}\nTeléfono: ${phone}\n\nNotas: ${
    notes || "-"
  }\n`;

  function handleExport() {
    if (!product) return;
    const blob = new Blob([quoteText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeSku = product.sku.replace(/[^a-z0-9_-]+/gi, "-");
    a.download = `cotizacion_${safeSku}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(quoteText);
      alert("Resumen copiado al portapapeles");
    } catch {
      alert("No se pudo copiar. Intenta exportar el archivo.");
    }
  }

  const isFormValid =
    companyName && companyRut && contactName && email.includes("@");

  return (
    <div className="product-detail-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link l1">
            Catálogo
          </Link>
          <span className="breadcrumb-separator l1">/</span>
          <Link to={`/product/${product.id}`} className="breadcrumb-link l1">
            {product.name}
          </Link>
          <span className="breadcrumb-separator l1">/</span>
          <span className="breadcrumb-current l1">Simulador de Cotización</span>
        </nav>

        <div className="product-detail">
          <div className="product-images">
            <div className="main-image">
              <div className="image-placeholder">
                <span className="material-icons">description</span>
              </div>
            </div>
          </div>

          <div className="product-details">
            <div className="product-header">
              <h1 className="product-title h2">Simulador de Cotización</h1>
              <p className="product-sku p1">
                {product.name} — SKU: {product.sku}
              </p>
            </div>

            <div className="selection-group">
              <h3 className="selection-title p1-medium">Datos de empresa</h3>
              <div className="price-range" style={{ display: "grid", gap: 8 }}>
                <input
                  className="search-input p1"
                  placeholder="Razón social"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <input
                  className="search-input p1"
                  placeholder="RUT"
                  value={companyRut}
                  onChange={(e) => setCompanyRut(e.target.value)}
                />
                <input
                  className="search-input p1"
                  placeholder="Nombre de contacto"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
                <input
                  className="search-input p1"
                  placeholder="Email de contacto"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="search-input p1"
                  placeholder="Teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <textarea
                  className="search-input p1"
                  placeholder="Notas adicionales"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="selection-group">
              <h3 className="selection-title p1-medium">Cantidad</h3>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() =>
                    setQuantity(clampQuantity(product, quantity - 1))
                  }
                >
                  <span className="material-icons">remove</span>
                </button>
                <input
                  type="number"
                  className="quantity-input"
                  value={quantity}
                  min={minQty}
                  max={maxQty}
                  onChange={(e) =>
                    setQuantity(
                      clampQuantity(product, parseInt(e.target.value))
                    )
                  }
                />
                <button
                  className="quantity-btn"
                  onClick={() =>
                    setQuantity(clampQuantity(product, quantity + 1))
                  }
                >
                  <span className="material-icons">add</span>
                </button>
              </div>
            </div>

            <div className="price-summary" style={{ marginTop: 16 }}>
              <div className="summary-row">
                <span className="summary-label p1">Precio unitario:</span>
                <span className="summary-value p1-medium">
                  {formatCLP(unitPrice, "code")}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label p1">Cantidad:</span>
                <span className="summary-value p1-medium">
                  {quantity} unidades
                </span>
              </div>
              <div className="summary-row total-row">
                <span className="summary-label p1-medium">Total estimado:</span>
                <span className="summary-value total-value h2">
                  {formatCLP(total, "code")}
                </span>
              </div>
            </div>

            <div className="calculator-actions" style={{ marginTop: 16 }}>
              <button
                className="btn btn-secondary cta1"
                onClick={handleCopy}
                disabled={!isFormValid}
              >
                <span className="material-icons">content_copy</span>
                Copiar resumen
              </button>
              <button
                className="btn btn-primary cta1"
                onClick={handleExport}
                disabled={!isFormValid}
              >
                <span className="material-icons">download</span>
                Exportar resumen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;
