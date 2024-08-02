import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import OrderProducts from '../components/DisplayOrderProducts.jsx'
import orderService from '../services/order.service.js'
import productService from '../services/product.service.js'

export default function Success() {
  const [searchParams] = useSearchParams()
  const [orderProducts, setOrderProducts] = useState([])
  const orderId = searchParams.get('orderId')
  useEffect(() => {
    if (!orderId) {
      return
    }
    const getOrderInfo = async () => {
      try {
        const data = await orderService.getOrder(orderId)

        const resolvePromise = await Promise.all(
          data.map(async (product) => {
            const getDetails = await productService.getProduct(
              product.product_id
            )
            return { quantity: product.quantity, details: getDetails }
          })
        )

        setOrderProducts(resolvePromise)
      } catch (e) {
        console.error('Error:', e)
      }
    }
    getOrderInfo()
  }, [orderId])

  return (
    <div className="container py-3">
      <h3 className="h3 text-center mt-4">
        Hooray!! Your order has been placed!
      </h3>
      <div className="">
        <h3 className="h3 mt-8">Order Summary</h3>
        <p className="fs-4">
          Your order ID: <strong className="order-id fs-4">{orderId}</strong>
        </p>
        <ul className="order-items p-0">
          {orderProducts.length > 0 &&
            orderProducts.map((product) => (
              <OrderProducts
                key={product.details.id}
                quantity={product.quantity}
                details={product.details}
              />
            ))}
        </ul>
      </div>
    </div>
  )
}
