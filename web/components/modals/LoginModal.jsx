import { useState, useContext } from 'react'
import AuthContext from '../../context/AuthContext'
import '../../css/modal.css'

const LoginModal = ({ handleClose, setIsLogin }) => {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [stayLoggedIn, setStayLoggedIn] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password, stayLoggedIn)
      handleClose()
    } catch (error) {
      console.error(error.response.data.message)
      alert('Login failed ' + error.response.data.message)
    }
  }

  return (
    <>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="loginEmail">Email address</label>
            <input
              type="email"
              className="form-control"
              id="loginEmail"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input
              type="password"
              className="form-control"
              id="loginPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="setLoggedIn"
              checked={stayLoggedIn}
              onChange={(e) => setStayLoggedIn(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="setLoggedIn">
              Keep me logged in
            </label>
          </div>
          <p>
            Not registered?{' '}
            <a href="#" onClick={() => setIsLogin(false)}>
              Register Now
            </a>
          </p>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </>
  )
}

export default LoginModal
