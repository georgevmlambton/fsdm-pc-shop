import { useContext, useState } from 'react'
import QuantitySelector from './QuantitySelector'
import AddToCartBtn from './AddToCartBtn'
import { CartContext } from '../../context/CartContext.jsx'
import { parsePrice } from '../../utils/currency.js'

const Description = ({ product }) => {
  const { addToCart } = useContext(CartContext)
  const [quantity, setQuantity] = useState(1)

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity)
  }

  return (
    <>
      {product ? (
        <div className="description col-12 col-md-6">
          <div className="desc-container">
            {/* Product title */}
            <h2 className="product-title">{product.name}</h2>
            <br />
            {/* Product description */}
            <p
              className="description-details"
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></p>
            {/* Product price */}
            <p className="price fw-bold fs-4">{parsePrice(product.price)}</p>
            {/* Stock count */}
            <p className="stockCount">{product.stock} left in stock</p>
            {/* Quantity selector and Add to Cart */}
            <div className="row">
              <div className="col-auto">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                />
              </div>
              <div className="col-auto ms-auto">
                <AddToCartBtn
                  onAddToCart={addToCart}
                  productId={product.id}
                  quantity={quantity}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="description col-12 col-md-6 bg-light placeholder-glow">
          <h2 className="product-title placeholder-glow">
            <span className="placeholder col-6"></span>
          </h2>
          <p className="description-details placeholder-glow">
            <span className="placeholder col-7"></span>
            <span className="placeholder col-4"></span>
            <span className="placeholder col-4"></span>
            <span className="placeholder col-6"></span>
            <span className="placeholder col-8"></span>
          </p>
          <ul className="placeholder-glow">
            <li className="placeholder col-6"></li>
            <li className="placeholder col-4"></li>
            <li className="placeholder col-4"></li>
          </ul>
          <p className="price placeholder-glow">
            <span className="placeholder col-3"></span>
          </p>
          <div className="row">
            <div className="col-auto">
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
              />
            </div>
            <div className="col-auto ms-auto">
              <AddToCartBtn onAddToCart={null} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Description
