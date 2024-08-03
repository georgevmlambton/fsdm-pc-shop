import { useContext } from 'react'
import AuthContext from '../../context/AuthContext.jsx'

const AddToCartBtn = ({ onAddToCart, productId, quantity }) => {
  const { user, showToast } = useContext(AuthContext)
  const handleOnClick = () => {
    if (user) {
      onAddToCart(productId, quantity)
    } else {
      showToast('Please login to add items to cart', 'danger')
    }
  }
  return (
    <button
      className="btn btn-dark py-1 rounded-pill px-2 class"
      onClick={handleOnClick}
    >
      ADD TO CART
    </button>
  )
}

export default AddToCartBtn
