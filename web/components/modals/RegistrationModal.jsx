import { useState, useContext } from 'react'
import AuthContext from '../../context/AuthContext'
import '../../css/modal.css'

const RegisterModal = ({ handleClose, setIsLogin }) => {
  const { register, showToast } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(name, email, password)
      handleClose()
      showToast('Registration successful', 'success')
    } catch (error) {
      showToast(error.message, 'danger')
    }
  }

  return (
    <>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="registerName">Name</label>
            <input
              type="text"
              className="form-control"
              id="registerName"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="registerEmail">Email address</label>
            <input
              type="email"
              className="form-control"
              id="registerEmail"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="registerPassword">Password</label>
            <input
              type="password"
              className="form-control"
              id="registerPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p>
            Already registered?{' '}
            <a href="#" onClick={() => setIsLogin(true)}>
              Login
            </a>
          </p>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    </>
  )
}

export default RegisterModal
