import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import classes from './css/Products.module.css'
import productService, {
  PaginatedProducts,
} from '../services/product.service.js'
import ProductListItem from '../components/ProductsListItem.jsx'
import PageNumbers from '../components/PageNumbers.jsx'

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState('')
  const [paginatedProducts, setPaginatedProducts] = useState(
    new PaginatedProducts([], 50, 1, 1)
  )
  let search = searchParams.get('search') || ''
  let category = searchParams.get('category') || ''
  let pageNumber = searchParams.get('page') || 1

  const products = paginatedProducts.products
  const maxPageNumbers = paginatedProducts.totalPages
  const productsPerPage = paginatedProducts.productsPerPage

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        productService
          .findProducts(category, search, pageNumber, productsPerPage)
          .then((paginatedProducts) => {
            setPaginatedProducts(paginatedProducts)
          })
      } catch (error) {
        console.error('Error fetching data', error)
      }
    }
    getAllProducts()
  }, [searchParams, pageNumber, category, productsPerPage, search])

  const handleSearchSubmit = (newSearch) => {
    newSearch.preventDefault()
    searchParams.set('page', 1)
    setSearchParams(searchParams)
  }

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value)
  }

  const onSearch = () => {
    searchParams.set('search', searchInput)
    setSearchParams(searchParams)
  }

  const onPageChange = (pageNumber) => {
    searchParams.set('page', pageNumber)
    setSearchParams(searchParams)
  }

  return (
    <>
      <div className="main">
        {/* Search bar container */}
        <div className="container mt-3 py-3">
          <form id="form" onSubmit={handleSearchSubmit}>
            <div className="input-group justify-content-center">
              <div className="form-outline w-50">
                <input
                  id="search-input"
                  type="search"
                  className="form-control"
                  placeholder="Search"
                  name="search"
                  value={searchInput}
                  onChange={handleSearchChange}
                />
              </div>
              <button
                id="search-button"
                className="btn btn-primary bg-sup-dark border-0"
                type="submit"
                onClick={onSearch}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>
        {/* Category Filter Container */}
        <div className="container my-3 pt-3">
          <div className="fs-2 fw-medium">Category</div>
          <hr />
          <div className="d-flex flex-row overflow-x-auto text-center fs-6">
            <Link
              to="/products"
              className="d-flex d-flex flex-column align-items-center text-decoration-none text-dark mx-2"
            >
              <img
                src="/img/home/c-icons/all.png"
                className={`${classes.box} p-1 bg-sdown-dark rounded`}
                alt=""
              />
              <label htmlFor="" className="text-light">
                .
              </label>
            </Link>
            <Link
              to="/products?category=cpu"
              className="d-row d-flex flex-column align-items-center text-center text-decoration-none text-dark mx-2"
            >
              <img
                src="/img/home/c-icons/cpu.png"
                className={`${classes.box} p-1 bg-sdown-dark rounded`}
                alt=""
                srcSet=""
              />
              <span className="pt-1">CPU</span>
            </Link>
            <Link
              to="/products?category=gpu"
              className="d-row d-flex flex-column align-items-center text-center text-decoration-none text-dark mx-2"
            >
              <img
                src="/img/home/c-icons/GPU.png"
                className={`${classes.box} p-1 bg-sdown-dark rounded`}
                alt=""
                srcSet=""
              />
              <span className="pt-1"> </span>
              GPU
            </Link>
            <Link
              to="/products?category=memory"
              className="d-row d-flex flex-column align-items-center text-center text-decoration-none text-dark mx-2"
            >
              <img
                src="/img/home/c-icons/ram.png"
                className={`${classes.box} p-1 bg-sdown-dark rounded`}
                alt=""
                srcSet=""
              />
              <span className="pt-1">Memory</span>
            </Link>
            <Link
              to="/products?category=cases"
              className="d-row d-flex flex-column align-items-center text-center text-decoration-none text-dark mx-2"
            >
              <img
                src="/img/home/c-icons/cases.png"
                className={`${classes.box} p-1 bg-sdown-dark rounded`}
                alt=""
                srcSet=""
              />
              <span className="pt-1">Cases</span>
            </Link>
            <Link
              to="/products?category=storage"
              className="d-row d-flex flex-column align-items-center text-center text-decoration-none text-dark mx-2"
            >
              <img
                src="/img/home/c-icons/storage.png"
                className={`${classes.box} p-1 bg-sdown-dark rounded`}
                alt=""
                srcSet=""
              />
              <span className="pt-1">Storage</span>
            </Link>
            <Link
              to="/products?category=power"
              className="d-row d-flex flex-column align-items-center text-center text-decoration-none text-dark mx-2"
            >
              <img
                src="/img/home/c-icons/power.png"
                className={`${classes.box} p-1 bg-sdown-dark rounded`}
                alt=""
                srcSet=""
              />
              <span className="pt-1">Power</span>
            </Link>
            <Link
              to="/products?category=monitor"
              className="d-row d-flex flex-column align-items-center text-center text-decoration-none text-dark mx-2"
            >
              <img
                src="/img/home/c-icons/monitor.png"
                className={`${classes.box} p-1 bg-sdown-dark rounded`}
                alt=""
                srcSet=""
              />
              <span className="pt-1">Monitor</span>
            </Link>
            <Link
              to="/products?category=accessories"
              className="d-row d-flex flex-column align-items-center text-center text-decoration-none text-dark mx-2"
            >
              <img
                src="/img/home/c-icons/keyboard.png"
                className={`${classes.box} p-1 bg-sdown-dark rounded`}
                alt=""
                srcSet=""
              />
              <span className="pt-1">Accessories</span>
            </Link>
          </div>
        </div>
        {/* Product search results */}

        <div className="container-fluid pt-3 bg-sup-dark">
          <div className="container">
            <div
              className="row p-0 m-0 row-cols-2 row-cols-md-5 g-3 justify-content-center"
              id="products-list"
            >
              <DisplayProducts productsList={products} />
            </div>
            <div
              className="row p-0 m-0 row-cols-2 row-cols-md-5 g-3 justify-content-center"
              id="placeholder-product"
            ></div>
          </div>

          <div id="pagination_div" className="py-3">
            <nav className="d-flex justify-content-center">
              <ul className="pagination m-0 p-0">
                {/*Previous button*/}
                <li
                  className={`${classes.pageItem} ${
                    pageNumber <= 1 ? 'disabled' : ''
                  }`}
                >
                  <a
                    className="page-link bg-sdown-dark text-light"
                    href="#"
                    aria-label="Previous"
                    onClick={() => onPageChange(+pageNumber - 1)}
                  >
                    &laquo;
                  </a>
                </li>
                <PageNumbers
                  products={products}
                  pageNumber={pageNumber}
                  productsPerPage={productsPerPage}
                  maxPageNumbers={maxPageNumbers}
                  handlePageChange={onPageChange}
                />
                {/*Next button*/}
                <li
                  className={`${classes.pageItem} ${
                    pageNumber >= maxPageNumbers ? 'disabled' : ''
                  }`}
                >
                  <a
                    className="page-link bg-sdown-dark text-light"
                    href="#"
                    aria-label="Next"
                    onClick={() => onPageChange(+pageNumber + 1)}
                  >
                    &raquo;
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

function DisplayProducts({ productsList }) {
  return (
    <>
      {productsList.map((product) => {
        let properties = {
          id: product.id,
          img: product.details.image,
          productName: product.name,
          price: productService.renderPrice(product.details.price),
        }
        return <ProductListItem key={product.id} {...properties} />
      })}
    </>
  )
}
