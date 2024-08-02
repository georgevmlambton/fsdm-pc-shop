const AddToCartBtn = ({ onAddToCart, productId, quantity }) => {
  return (
    <button
      className="btn btn-dark py-1 rounded-pill px-2 class"
      onClick={() => onAddToCart(productId, quantity)}
    >
      ADD TO CART
    </button>
  )
}

export default AddToCartBtn
