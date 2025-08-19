// CartPage.tsx
import { useCart } from "../context/CartContext";
import { formatCLP } from "../utils/currency"; // 👈 importar helper
import "./CartPage.css";

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCart();

  if (items.length === 0) return <p className="empty">Tu carrito está vacío</p>;

  const totalGeneral = items.reduce((acc, it) => acc + it.totalPrice, 0);

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛒 Tu Carrito</h1>

      <ul className="cart-list">
        {items.map((it) => (
          <li key={it.id} className="cart-item">
            <div className="cart-img-box">
              {/* Reemplazo imagen real por el icono */}
              <span className="material-icons cart-img">image</span>
            </div>
            <div className="cart-info">
              <h2 className="cart-name">{it.name}</h2>
              <p className="cart-details">
                {it.quantity} x {formatCLP(it.unitPrice, "code")}
              </p>
              <p className="cart-price">= {formatCLP(it.totalPrice, "code")}</p>
              <button
                className="cart-remove"
                onClick={() => removeFromCart(it.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-footer">
        <h2 className="cart-total">Total: {formatCLP(totalGeneral, "code")}</h2>
        <button className="cart-clear" onClick={clearCart}>
          Vaciar carrito
        </button>
        <button
          className="buy-btn"
          onClick={() => alert("Función disponible próximamente")}
        >
          Comprar
        </button>
      </div>
    </div>
  );
}

// CartPage.tsx
// import { useCart } from "../context/CartContext";
// import "./CartPage.css";

// export default function CartPage() {
//   const { items, removeFromCart, clearCart } = useCart();

//   if (items.length === 0) return <p className="empty">Tu carrito está vacío</p>;

//   const totalGeneral = items.reduce((acc, it) => acc + it.totalPrice, 0);

//   return (
//     <div className="cart-container">
//       <h1 className="cart-title">🛒 Tu Carrito</h1>

//       <ul className="cart-list">
//         {items.map((it) => (
//           <li key={it.id} className="cart-item">
//             <div className="cart-img-box">
//               {/* Reemplazo imagen real por el icono */}
//               <span className="material-icons cart-img">image</span>
//             </div>
//             <div className="cart-info">
//               <h2 className="cart-name">{it.name}</h2>
//               <p className="cart-details">
//                 {it.quantity} x ${it.unitPrice.toFixed(2)}
//               </p>
//               <p className="cart-price">= ${it.totalPrice.toFixed(2)}</p>
//               <button
//                 className="cart-remove"
//                 onClick={() => removeFromCart(it.id)}
//               >
//                 Eliminar
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       <div className="cart-footer">
//         <h2 className="cart-total">Total: ${totalGeneral.toFixed(2)}</h2>
//         <button className="cart-clear" onClick={clearCart}>
//           Vaciar carrito
//         </button>
//       </div>
//     </div>
//   );
// }
