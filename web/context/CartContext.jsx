import { createContext, useContext, useEffect, useState } from 'react'
import cartService from '../services/cart.service.js'
import AuthContext from './AuthContext.jsx'

export const CartContext = createContext()

const CartProvider = ({ children }) => {
  const { showToast } = useContext(AuthContext)
  const [cart, setCart] = useState({
    items: [],
    subTotal: 0,
    taxes: 0,
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  const updateCart = async () => {
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
      setIsLoading(false)
    }
  }

  const removeItem = async (item) => {
    await cartService.removeFromCart(item.product.id)
    updateCart()
  }

  const addToCart = async (id, quantity) => {
    await cartService.addToCart(id, quantity)
    updateCart()
    showToast('Item added to cart')
  }

  const checkout = async () => {
    const orderId = await cartService.checkout()
    setCart({ items: [], subTotal: 0, taxes: 0, total: 0 })
    return orderId
  }

  const emptyCart = async () => {
    await cartService.emptyCart()
    setCart({ items: [], subTotal: 0, taxes: 0, total: 0 })
  }

  const setQuantity = async (product_id, quantity) => {
    await cartService.setQuantity(product_id, quantity)
    updateCart()
  }

  useEffect(() => {
    updateCart()
  }, [])

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
