const productsPerPage = 50
async function loadProducts(category = '', search = '', pageNumber = 1) {
  const productPlaceholder = await $.get(
    '/v1/components/products-placeholder.html'
  )
  $('#placeholder-product').append(productPlaceholder)
  $('#products-list').hide()
  $('#placeholder-product').show()
  var productDetails = await productService.findProducts(
    category,
    search,
    pageNumber,
    productsPerPage
  )
  var products = productDetails.products
  setUpPagination(pageNumber, productDetails.totalPages)

  await displayProducts(products)
  $('#placeholder-product').hide()
  $('#products-list').show()
}

async function displayProducts(products) {
  const productTemplate = await $.get('components/product-list.html')
  products.forEach((product) =>
    generateColumn(
      productTemplate,
      product.id,
      product.details.image,
      product.name,
      product.details.price
    )
  )
}

function setUpPagination(activePage, totalPages) {
  if (totalPages > 1) {
    const page1Button = $('.page-number')
    const buttons = []

    for (let i = 2; i <= totalPages; i++) {
      const button = page1Button.clone()
      $(button).children('.page-link').attr('data-page', i).text(i)
      buttons.push(button)
    }

    page1Button.after(buttons)
  }

  $(`[data-page=${activePage}]`).addClass('active')

  $('.page-item.previous .page-link').click(function () {
    if (activePage > 1) {
      goToPage(activePage - 1)
    }
    return false
  })

  $('.page-item.next .page-link').click(function () {
    if (activePage < totalPages) {
      goToPage(activePage + 1)
    }
    return false
  })

  $('.page-item.page-number .page-link').click(function () {
    var pageNumber = parseInt($(this).attr('data-page'))
    goToPage(pageNumber)
    return false
  })
}

function goToPage(pageNumber) {
  const url = new URL(window.location)
  url.searchParams.set('page', pageNumber)
  window.location.href = url
}

function generateColumn(template, id, imgURL, Title, price) {
  const productList = $.parseHTML(template)
  $(productList).find('.image-placeholder').attr('src', imgURL)
  $(productList).find('.product-name').html(Title)
  $(productList)
    .find('.product-link')
    .each(function () {
      $(this).attr('href', `/v1/product?id=${id}`)
    })
  $(productList).find('.product-price').text(productService.renderPrice(price))

  $('#products-list').append(productList)
}

function reloadWebpageWithFilters() {
  let searchValue = $('#search-input').val()
  if (!searchValue) {
    return
  } else {
    const url = new URL(window.location.href)
    url.searchParams.set('search', searchValue)
    window.location.href = url
  }
}

function retrieveFiltersFromURL() {
  // Retrieve category and search filters from the url
  let params = new URLSearchParams(document.location.search) // Fetches current URL
  let category = params.get('category') || '' // Stores the value from the url after "category=" and stops at & if present. If category isn't present, category = ''
  let search = params.get('search') || ''
  let page = parseInt(params.get('page') || '1')
  // Fetches products with the category and search filters
  loadProducts(category, search, page)
}

function onSubmit(e) {
  reloadWebpageWithFilters()
  return false
}

$('#form').submit(onSubmit)

retrieveFiltersFromURL()
