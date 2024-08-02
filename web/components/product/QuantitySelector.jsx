const QuantitySelector = ({ quantity, onQuantityChange, isCart }) => {
  const handleIncrement = () => {
    onQuantityChange(quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1)
    }
  }

  return (
    <div
      className={`d-flex border border-dark border-3 rounded-pill ${
        isCart ? 'bg-white' : ''
      }`}
    >
      <button
        className="increaseQuantity border-0 bg-transparent"
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
        className="form-control text-dark text-center border-0 bg-transparent p-0"
        style={isCart ? { width: '100%' } : { width: '7ch' }}
      />
      <button
        className="decreaseQuantity border-0 bg-transparent"
        onClick={handleDecrement}
      >
        -
      </button>
    </div>
  )
}

export default QuantitySelector
