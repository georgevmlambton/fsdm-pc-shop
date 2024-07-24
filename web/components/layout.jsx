import { Outlet } from 'react-router-dom'
import Header from './header.jsx'
import Footer from './footer.jsx'

const Layout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
