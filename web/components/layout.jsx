import { Outlet } from 'react-router-dom'
import Header from './header.jsx'
import Footer from './footer.jsx'
import ToastMessage from './product/ToastMessage.jsx'

const Layout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ToastMessage />
    </div>
  )
}

export default Layout
