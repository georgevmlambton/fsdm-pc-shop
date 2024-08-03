import { useContext } from 'react'
import { Toast } from 'react-bootstrap'
import AuthContext from '../../context/AuthContext.jsx'

const ToastMessage = () => {
  const { setToastState, toastState } = useContext(AuthContext)
  return (
    <>
      {toastState.showToast && (
        <Toast
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
          }}
          show={toastState.showToast}
          className="d-inline-block m-1"
          bg={toastState.variant ?? 'success'}
          delay={3000}
          autohide
          onClose={() => setToastState({ showToast: false, toastMessage: '' })}
        >
          <Toast.Body style={{ color: 'white' }}>
            {toastState.toastMessage}
          </Toast.Body>
        </Toast>
      )}
    </>
  )
}

export default ToastMessage
