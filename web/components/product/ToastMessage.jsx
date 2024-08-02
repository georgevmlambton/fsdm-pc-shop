import { useContext } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import AuthContext from '../../context/AuthContext.jsx'

const ToastMessage = () => {
  const { setToastState, toastState } = useContext(AuthContext)
  return (
    <ToastContainer
      className="p-3"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
      }}
    >
      <Toast
        show={toastState.showToast}
        onClose={() => setToastState({ showToast: false, toastMessage: '' })}
        delay={3000}
        bg={toastState.variant ?? 'success'}
        autohide
      >
        <Toast.Body className="bg-success rounded text-light">
          <i className="bi bi-bag-check mx-2"></i>
          {toastState.toastMessage}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default ToastMessage
