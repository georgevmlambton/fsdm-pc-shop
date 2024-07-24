import { createContext, useEffect, useState } from 'react'
import cartService from '../services/cart.service.js'

export const CartContext = createContext()

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    subTotal: 0,
    taxes: 0,
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  const updateCart = async () => {
    const items = await cartService.getCartItems()
    const products = await cartService.getCartProducts()

    const cartItems = items.map((item, i) => ({
      ...item,
      product: products[i],
    }))

    const subTotal = products.reduce(
      (total, product, i) => (total += items[i].quantity * product.price),
      0
    )

    const taxes = subTotal * 0.13
    const total = subTotal + taxes

    return {
      items: cartItems,
      subTotal,
      taxes,
      total,
    }
  }

  const removeItem = async (item) => {
    await cartService.removeFromCart(item.product.id)
    updateCart().then((cart) => {
      setCart(cart)
    })
  }

  useEffect(() => {
    setIsLoading(true)
    updateCart().then((cart) => {
      setCart(cart)
      setIsLoading(false)
    })
  }, [])

  return (
    <CartContext.Provider value={{ cart, isLoading, removeItem }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider
