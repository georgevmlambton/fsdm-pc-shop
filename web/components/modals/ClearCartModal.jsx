import '../../css/modal.css'

export default function ClearCartModal({
  handleClearCart,
  setClearCartModalState,
  clearCartModalState,
}) {
  return (
    <div
      className={`modal fade ${clearCartModalState ? 'show' : ''}`}
      style={{ display: clearCartModalState ? 'block' : 'none' }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmation</h5>
            <a
              href="#"
              onClick={() => {
                setClearCartModalState(false)
              }}
            >
              <i className="bi bi-x-lg text-light"></i>
            </a>
          </div>
          <div className="modal-body">
            <form onSubmit={handleClearCart}>
              <p>Are you sure you want to clear your cart?</p>
              <button
                onClick={() => setClearCartModalState(false)}
                className="btn btn-primary"
                style={{
                  marginRight: '10px',
                  backgroundColor: 'transparent',
                  color: 'black',
                }}
              >
                No
              </button>
              <button type="submit" className="btn btn-primary">
                Yes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
