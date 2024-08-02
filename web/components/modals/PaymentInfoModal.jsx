import '../../css/modal.css'

export default function PaymentInfo({
  handleCheckout,
  changeDisplayPaymentInfoState,
  displayPaymentInfo,
}) {
  return (
    <div
      className={`modal fade ${displayPaymentInfo ? 'show' : ''}`}
      style={{ display: displayPaymentInfo ? 'block' : 'none' }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Payment</h5>
            <a href="#" onClick={changeDisplayPaymentInfoState}>
              <i className="bi bi-x-lg text-light"></i>
            </a>
          </div>
          <div className="modal-body">
            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  className="form-control mb-3"
                  type="text"
                  id="name"
                  placeholder="Name"
                  pattern="^[A-Za-z]+(?: [A-Za-z]+){1,2}$"
                  maxLength={40}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  className="form-control mb-3"
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  pattern="^(\d{4} ?){4}$"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="expiry">Expiry</label>
                <input
                  className="form-control mb-3"
                  type="text"
                  id="expiry"
                  placeholder="MM/YYYY"
                  pattern="^(0[1-9]|1[0-2])\/\d{4}$"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV/CVC</label>
                <input
                  className="form-control mb-3 pt-2 "
                  type="password"
                  id="cvv"
                  placeholder="***"
                  pattern="\d{3}"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Place Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
