import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import cartService from '../services/cart.service.js'
import AuthContext from './AuthContext.jsx'

export const CartContext = createContext()

const CartProvider = ({ children }) => {
  const { showToast, user } = useContext(AuthContext)
  const [cart, setCart] = useState({
    items: [],
    subTotal: 0,
    taxes: 0,
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  const updateCart = useCallback(async () => {
    setIsLoading(true)
    try {
      const items = await cartService.getCart()

      const subTotal = items.reduce((total, item, i) => {
        return (total += items[i].quantity * item.product.price)
      }, 0)

      const taxes = subTotal * 0.13
      const total = subTotal + taxes
      setCart({
        items,
        subTotal,
        taxes,
        total,
      })
      setIsLoading(false)
    } catch (e) {
      showToast('Error fetching cart ' + e.message, 'danger')
      setIsLoading(false)
    }
  }, [showToast])

  const removeItem = async (item) => {
    try {
      await cartService.removeFromCart(item.product.id)
      updateCart()
    } catch (e) {
      showToast('Error removing item ' + e.message, 'danger')
    }
  }

  const addToCart = async (id, quantity) => {
    try {
      await cartService.addToCart(id, quantity)
      updateCart()
      showToast('Item added to cart')
    } catch (e) {
      showToast('Error adding item to cart ' + e.message, 'danger')
    }
  }

  const checkout = async () => {
    try {
      const orderId = await cartService.checkout()
      setCart({ items: [], subTotal: 0, taxes: 0, total: 0 })
      return orderId
    } catch (e) {
      showToast('Error checking out ' + e.message, 'danger')
    }
  }

  const emptyCart = async () => {
    try {
      await cartService.emptyCart()
      setCart({ items: [], subTotal: 0, taxes: 0, total: 0 })
    } catch (e) {
      showToast('Error emptying cart ' + e.message, 'danger')
    }
  }

  const setQuantity = async (product_id, quantity) => {
    try {
      await cartService.setQuantity(product_id, quantity)
      updateCart()
    } catch (e) {
      showToast('Error setting quantity ' + e.message, 'danger')
    }
  }

  useEffect(() => {
    if (user) {
      updateCart()
    }
  }, [updateCart, user])

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        removeItem,
        addToCart,
        checkout,
        emptyCart,
        setQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider
