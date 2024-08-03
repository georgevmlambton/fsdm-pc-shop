import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import './css/common.css'
import { FourOhFour } from './pages/404.jsx'
import { Home } from './pages/home.jsx'
import { Products } from './pages/Products.jsx'
import Product from './pages/product.jsx'
import Cart from './pages/cart/cart.jsx'
import Success from './pages/Success.jsx'
import Layout from './components/layout.jsx'
import CartProvider from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoutes from './components/ProtectedRoutes.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/product/:id',
        element: <Product />,
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: '/cart',
            element: <Cart />,
          },
          { path: '/success', element: <Success /> },
        ],
      },
      {
        path: '/products',
        element: <Products />,
      },

      {
        path: '*',
        element: <FourOhFour />,
      },
    ],
  },
])

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
