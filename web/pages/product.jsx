import { useState, useEffect } from 'react'
import productService from '../services/product.service.js'
import ProductContainer from '../components/product/ProductContainer.jsx'
import { useParams } from 'react-router-dom'

const Product = () => {
  const [product, setProduct] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await productService.getProduct(id)
        setProduct(response) // Assuming response.data is the product details JSON
      } catch (error) {
        console.error('Error fetching product details:', error)
        setProduct(null) // Set product to null if there's an error
      }
    }

    fetchProduct()
  }, [id]) // Include id in the dependency array to fetch new product when id changes

  return <ProductContainer product={product} />
}

export default Product
