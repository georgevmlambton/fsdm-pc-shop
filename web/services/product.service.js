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
  url = 'https://fsdm-pc-shop-v1.georgevm.com'

  async findProducts(category, search, pageNumber, productsPerPage) {
    let products = await this.getProducts(pageNumber, category, search)
    return this.paginateProducts(products, pageNumber, productsPerPage)
  }

  async getProduct(id) {
    let output = await $.ajax({
      url: `${this.url}/products/` + id, // Replace URL with the prod url
      type: 'GET',
      success: () => {
        // Add success logic if any
      },
      error: function (_, status, error) {
        console.error(
          'GET request failed with status',
          status,
          'and error',
          error
        )
      },
    })
    return output
  }

  async getProducts(pageNumber, category, search) {
    let output = await $.ajax({
      url: `${this.url}/products?page=${pageNumber}&category=${category}&search=${search}`, // Replace URL with the prod url
      type: 'GET',
      success: () => {
        // Add success logic if any
      },
      error: function (_, status, error) {
        console.error(
          'GET request failed with status',
          status,
          'and error',
          error
        )
      },
    })
    return output
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
    let output = await $.ajax({
      url: `${this.url}/products/featured`, // Replace URL with the prod url
      type: 'GET',
      success: () => {
        // Add success logic if any
      },
      error: function (_, status, error) {
        console.error(
          'GET request failed with status',
          status,
          'and error',
          error
        )
      },
    })
    return output.products
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
