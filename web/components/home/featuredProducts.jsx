import { useEffect, useState } from 'react'
import productService from '../../services/product.service.js'
import ProductListItem from '../ProductsListItem.jsx'

export default function FeaturedProducts() {
  let [products, setProducts] = useState(null)

  useEffect(() => {
    const getProducts = async () =>
      productService
        .getFeaturedProducts()
        .then((product) => setProducts(product))
    getProducts()
  }, [])

  return (
    <>
      <div className="container-fluid bg-sup-dark p-3 d-flex flex-column justify-content-center align-items-center">
        <div
          id="featured"
          className="container d-flex flex-column bg-sup-dark align-items-center m-5"
        >
          <p className="text-light fs-2 fw-bold">Featured Products</p>
          <p className="text-light fs-3 text-center">
            Hurry up! Our best products are running out!
          </p>
        </div>
        {/* Featured Images */}
        <div className="container-fluid mb-5 bg-sup-dark">
          <div className="container">
            <div
              className="row p-0 m-0 row-cols-2 row-cols-md-5 g-3 justify-content-center fs-3 mb-5"
              id="products-list"
            >
              {products ? <DisplayProducts products={products} /> : <></>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function DisplayProducts({ products }) {
  console.log(products)
  return (
    <>
      {products.map((product) => {
        let properties = {
          id: product.id,
          img: product.image,
          productName: product.name,
          price: productService.renderPrice(product.price),
        }
        return <ProductListItem key={product.id} {...properties} />
      })}
    </>
  )
}
