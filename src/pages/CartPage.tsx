// CartPage.tsx
import { useCart } from "../context/CartContext";
import "./CartPage.css";

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCart();

  if (items.length === 0)
    return <p className="cart-empty">Tu carrito está vacío</p>;

  return (
    <div className="cart-page">
      <h1>Carrito</h1>
      <ul className="cart-list">
        {items.map((it) => (
          <li key={it.id} className="cart-item">
            <span>
              {it.name} — {it.quantity} x ${it.unitPrice} = ${it.totalPrice}
            </span>
            <button onClick={() => removeFromCart(it.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <button className="clear-btn" onClick={clearCart}>
        Vaciar carrito
      </button>
    </div>
  );
}
