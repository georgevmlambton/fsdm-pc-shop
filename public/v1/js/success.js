function renderItem(cartElement, product, quantity) {
  $(cartElement)
    .find('.product-link')
    .each(function () {
      $(this).attr('href', `/v1/product?id=${product.id}`)
    })
  $(cartElement).find('.image-placeholder').attr('src', product.image)
  $(cartElement).find('.product-name').html(product.name)
  $(cartElement).find('.quantity').text(quantity)
  $(cartElement)
    .find('.item-price')
    .text(productService.renderPrice(product.price * quantity))
}

async function renderSummary() {
  const template = await $.get('components/order-summary-item.html')
  var urlParams = new URLSearchParams(window.location.search)
  var orderID = parseInt(urlParams.get('orderID'))
  $('.order-items').hide()
  $('.order-id').text(orderID)
  const order = await cartService.getOrder(orderID)
  if (order.length == 0) {
    location.replace('/404.html')
  }
  var elementArray = order.map(async (item, i) => {
    const orderItemElement = $.parseHTML(template)
    const product = await productService.getProduct(item.product_id)
    renderItem(orderItemElement, product, item.quantity)
    $('.order-items').append(orderItemElement)
  })
  await Promise.all(elementArray)
  $('.order-items').show()
}

renderSummary()
