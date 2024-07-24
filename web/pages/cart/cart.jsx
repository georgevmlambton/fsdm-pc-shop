import { useContext } from 'react'
import './cart.css'
import { CartContext } from '../../context/CartContext.jsx'
import Loader from '../../components/loader.jsx'
import { parsePrice } from '../../utils/currency.js'
import cartService from '../../services/cart.service.js'

const CartItem = ({ item }) => {
  const { removeItem } = useContext(CartContext)
  const quantity = item.quantity
  return (
    <li className="product-item list-group-item d-flex justify-content-between align-items-center">
      <div className="product-details">
        <div className="d-flex justify-content-between align-items-center">
          <img src={item.product.image} className="image-placeholder" />
          <div className="product">
            <a className="product-link" href={`/product/${item.product.id}`}>
              <p className="product-name">{item.product.name}</p>
            </a>

            <div className="quantity-selector">
              <div className="stockButton stockButton-filled">
                <button className="increaseQuantity">+</button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  disabled
                  min="1"
                />
                <button className="decreaseQuantity" disabled>
                  -
                </button>
              </div>
            </div>
          </div>
        </div>
        <i
          className="bi bi-x remove-product"
          onClick={() => removeItem(item)}
        ></i>
        <div className="item-price">
          {parsePrice(item.product.price * quantity)}
        </div>
      </div>
    </li>
  )
}

export const Summary = ({ cart }) => {
  const handleCheckout = async () => {
    try {
      await cartService.checkout()
    } catch (error) {
      console.error('CartService.checkou() failed, error: ', error)
    }
  }

  return (
    <div className="col-12 col-md-4 cart-total">
      <div className="summary-container">
        <h3>Summary</h3>
        <hr style={{ color: 'white' }} />
        <table>
          <tbody>
            <tr>
              <td>Subtotal</td>
              <td className="subtotal">{parsePrice(cart.subTotal)}</td>
            </tr>
            <tr>
              <td>Taxes</td>
              <td className="taxes">{parsePrice(cart.taxes)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="checkout-container">
        <table>
          <tbody>
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td className="total">{parsePrice(cart.total)}</td>
            </tr>
          </tbody>
        </table>
        <div className="checkout">
          <button
            className="btn btn-checkout"
            type="submit"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

const Cart = () => {
  const { cart, isLoading } = useContext(CartContext)
  const handleEmptyCart = async () => {
    try {
      cartService.emptyCart()
      window.location.reload()
    } catch (error) {
      console.error('Unable to empty cart', error)
    }
  }
  return (
    <>
      <div className="container title-container py-3">
        <h1>Your Cart</h1>
        {cart.items.length > 0 && (
          <button
            className="btn button-round button-round-filled empty-cart-button"
            onClick={handleEmptyCart}
          >
            Empty Cart
          </button>
        )}
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8">
            <ul className="list-group cart-items">
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  {cart.items.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </>
              )}
            </ul>
          </div>
          {cart.items.length > 0 && <Summary cart={cart} />}
        </div>
      </div>
      {cart.items.length === 0 && (
        <div className="empty-cart-logo">
          <img src="/img/emptyCart.jpg" alt="empty-cart" />
          <div className="text-center">Your Cart is empty</div>
        </div>
      )}
    </>
  )
}

export default Cart
