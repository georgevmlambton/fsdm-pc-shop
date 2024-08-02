import { useContext, useState } from 'react'
import '../../css/cart.css'
import { CartContext } from '../../context/CartContext.jsx'
import Loader from '../../components/loader.jsx'
import { parsePrice } from '../../utils/currency.js'
import PaymentInfo from '../../components/modals/PaymentInfoModal.jsx'
import { Link, useNavigate } from 'react-router-dom'
import QuantitySelector from '../../components/product/QuantitySelector.jsx'
import ClearCartModal from '../../components/modals/ClearCartModal.jsx'
import AuthContext from '../../context/AuthContext.jsx'

const CartItem = ({ item }) => {
  const { removeItem, setQuantity } = useContext(CartContext)
  const quantity = item.quantity
  const handleQuantityChange = async (newQuantity) => {
    await setQuantity(item.product.id, newQuantity)
  }
  return (
    <li className="product-item list-group-item d-flex justify-content-between align-items-center">
      <div className="product-details">
        <div className="d-flex justify-content-between align-items-center">
          <img src={item.product.image} className="image-placeholder" />
          <div className="product">
            <Link className="product-link" to={`/product/${item.product.id}`}>
              <p className="product-name">{item.product.name}</p>
            </Link>

            <div className="quantity-selector">
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                isCart={true}
              />
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
  const [displayPaymentInfo, setDisplayPaymentInfo] = useState(false)
  const navigate = useNavigate()
  const { checkout } = useContext(CartContext)

  const handleCheckout = async (e) => {
    e.preventDefault()
    try {
      const orderId = await checkout()
      navigate(`/success?orderId=${orderId}`)
    } catch (error) {
      console.error('CartService.checkout() failed, error: ', error)
    }
  }

  const handleDisplayPaymentInfo = () => {
    setDisplayPaymentInfo(!displayPaymentInfo)
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
            onClick={() => setDisplayPaymentInfo(true)}
          >
            Checkout
          </button>
        </div>
      </div>

      {displayPaymentInfo === true && (
        <PaymentInfo
          handleCheckout={handleCheckout}
          displayPaymentInfo={displayPaymentInfo}
          changeDisplayPaymentInfoState={handleDisplayPaymentInfo}
        />
      )}
    </div>
  )
}

const Cart = () => {
  const { cart, isLoading, emptyCart } = useContext(CartContext)
  const { showToast } = useContext(AuthContext)

  const [clearCartModalState, setClearCartModalState] = useState(false)
  const handleClearCart = async (e) => {
    try {
      e.preventDefault()
      await emptyCart()
      setClearCartModalState(false)
      showToast('Cart has been emptied')
    } catch (error) {
      showToast('Failed to empty cart ' + error.message, 'danger')
    }
  }
  return (
    <>
      <div className="container title-container py-3">
        <h1>Your Cart</h1>
        {cart.items.length > 0 && (
          <button
            className="btn button-round button-round-filled empty-cart-button"
            onClick={() => {
              setClearCartModalState(true)
            }}
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
      {cart.items.length === 0 && !isLoading && (
        <div className="empty-cart-logo">
          <img src="/img/emptyCart.jpg" alt="empty-cart" />
          <div className="text-center">Your Cart is empty</div>
        </div>
      )}
      <ClearCartModal
        handleClearCart={handleClearCart}
        clearCartModalState={clearCartModalState}
        setClearCartModalState={setClearCartModalState}
      />
    </>
  )
}

export default Cart
