import { useState } from 'react'
const QuantitySelector = () => {
  const [quantity, setQuantity] = useState(1)

  const handleIncrement = () => {
    setQuantity(quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="d-flex border border-dark border-3 rounded-pill ">
      <button
        className="increaseQuantity border-0 bg-transparent "
        onClick={handleIncrement}
      >
        +
      </button>
      <input
        type="number"
        id="quantity"
        name="quantity"
        value={quantity}
        disabled
        min="1"
        className="form-control text-dark text-center border-0 bg-transparent p-0 "
        style={{ width: '7ch' }}
      />
      <button
        className="decreaseQuantity border-0 bg-transparent "
        onClick={handleDecrement}
      >
        -
      </button>
    </div>
  )
}

export default QuantitySelector
