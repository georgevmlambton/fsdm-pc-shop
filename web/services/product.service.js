import userService from './user.service.js'

export class PaginatedProducts {
  products = []
  productsPerPage
  pageNumber
  totalPages

  constructor(products, productsPerPage, pageNumber, totalPages) {
    this.products = products
    this.productsPerPage = productsPerPage
    this.pageNumber = pageNumber
    this.totalPages = totalPages
  }
}

class ProductService {
  url = '/api'

  async findProducts(category, search, pageNumber, productsPerPage) {
    let products = await this.getProducts(pageNumber, category, search)
    return this.paginateProducts(products, pageNumber, productsPerPage)
  }

  async getProduct(id) {
    try {
      const response = await fetch(`${this.url}/products/` + id, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      })
      const data = await response.json()
      return data
    } catch (e) {
      throw new Error(e)
    }
  }

  async getProducts(pageNumber, category, search) {
    try {
      const response = await fetch(
        `${this.url}/products?page=${pageNumber}&category=${category}&search=${search}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        }
      )
      const data = await response.json()
      return data
    } catch (e) {
      throw new Error(e)
    }
  }

  renderPrice(price) {
    const priceInDollars = price / 100
    return (
      'C' +
      new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
      }).format(priceInDollars)
    )
  }

  filterProducts(products, category = '', search = '') {
    if (category) {
      products = products.filter(function (product) {
        return product.category === category
      })
    }

    if (search) {
      products = products.filter(function (product) {
        return product.name.toLowerCase().includes(search)
      })
    }
    return products
  }

  async getFeaturedProducts() {
    try {
      const response = await fetch(`${this.url}/products/featured`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userService.getAuth(),
        },
        method: 'GET',
      })
      const data = await response.json()
      console.log(data)
      return data.products
    } catch (e) {
      throw new Error(e)
    }
  }

  paginateProducts(products, pageNumber, productsPerPage) {
    var totalPages = products.total_pages

    return new PaginatedProducts(
      products.products,
      productsPerPage,
      pageNumber,
      totalPages
    )
  }
}

const productService = new ProductService()

export default productService
