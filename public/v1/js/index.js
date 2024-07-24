async function getProduct() {
  //amount is how many products will load.
  let featuredProducts = await productService.getFeaturedProducts()
  featuredProducts.forEach(async (product) => {
    displayProducts(product)
  })
}

async function displayProducts(products) {
  const productTemplate = await $.get('components/featured-products.html')
  generateColumn(
    productTemplate,
    products.id,
    products.image,
    products.name,
    products.price
  )
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

getProduct()
