import { useState } from 'react'
import RegisterModal from './RegistrationModal.jsx'
import LoginModal from './LoginModal.jsx'
import '../../css/modal.css'

const AuthModal = ({ show, handleClose }) => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div
      className={`modal fade ${show ? 'show' : ''}`}
      style={{ display: show ? 'block' : 'none' }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isLogin ? 'Login' : 'Register'}</h5>
            <a href="#" onClick={handleClose}>
              <i className="bi bi-x-lg text-light"></i>
            </a>
          </div>
          {isLogin ? (
            <LoginModal setIsLogin={setIsLogin} handleClose={handleClose} />
          ) : (
            <RegisterModal setIsLogin={setIsLogin} handleClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
