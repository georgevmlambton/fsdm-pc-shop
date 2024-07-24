var cartAmount = 0
var products = []

function populateCart(cartElement, product, quantity) {
  $(cartElement)
    .find('.product-link')
    .each(function () {
      $(this).attr('href', `/v1/product?id=${product.id}`)
    })
  $(cartElement).find('.image-placeholder').attr('src', product.image)
  $(cartElement).find('.product-name').html(product.name)
  $(cartElement)
    .find('.item-price')
    .text(productService.renderPrice(product.price * quantity))
  $(cartElement).find('#quantity').attr('value', quantity)
  $(cartElement)
    .find('.remove-product')
    .click(() => {
      cartService.removeFromCart(product.id)
    })

  var increaseButton = $(cartElement).find('.increaseQuantity')
  var decreaseButton = $(cartElement).find('.decreaseQuantity')
  var quantityElem = $(cartElement).find('#quantity')

  if (quantity > 1) {
    decreaseButton.prop('disabled', false)
  }
  increaseButton.click(async function (e) {
    e.preventDefault()
    var currentQuantity = parseInt(quantityElem.val())
    quantityElem.val(currentQuantity + 1)
    await cartService.setQuantity(product.id, currentQuantity + 1)
    if (currentQuantity + 1 > 1) {
      decreaseButton.prop('disabled', false)
    }
    $(cartElement)
      .find('.item-price')
      .text(productService.renderPrice(product.price * (currentQuantity + 1)))
    cartService.updateTotal()
  })

  decreaseButton.click(async function (e) {
    e.preventDefault()
    var currentQuantity = parseInt(quantityElem.val())
    if (currentQuantity > 1) {
      quantityElem.val(currentQuantity - 1)
      await cartService.setQuantity(product.id, currentQuantity - 1)

      if (quantityElem.val() == 1) {
        $(this).prop('disabled', true)
      }
    }
    $(cartElement)
      .find('.item-price')
      .text(productService.renderPrice(product.price * (currentQuantity - 1)))
    cartService.updateTotal()
  })
}

async function renderCart() {
  const template = await $.get('components/cart-items.html')
  products = await cartService.getCartProducts()
  var cart = await cartService.getCartItems()
  products.forEach((product, i) => {
    const cartElement = $.parseHTML(template)
    populateCart(cartElement, product, cart[i].quantity)
    $('.cart-items').append(cartElement)
  })
}

async function getCart() {
  $('.cart-items').html(' ')
  var cartCount = await cartService.getCartItemsCount()
  if (!cartCount) {
    $('.empty-cart-button').hide()
    $('.cart-total').hide()
    $('.empty-cart-logo').show()
  } else {
    $('.empty-cart-logo').hide()
    $('.empty-cart').click((e) => {
      e.preventDefault()
      cartService.emptyCart()
      cartService.updateTotal()
    })
    await renderCart()
    cartService.updateTotal()
  }
}

function setTotal(subtotal, taxes, total) {
  $('.subtotal').html(productService.renderPrice(subtotal))
  $('.taxes').html(productService.renderPrice(taxes))
  $('.total').html(productService.renderPrice(total))
}

async function updateTotal() {
  var cart = await cartService.getCartItems()
  cartAmount = 0
  products.forEach((product, i) => {
    cartAmount += product.price * cart[i].quantity
  })
  var taxes = cartAmount * 0.13
  var totalAmount = cartAmount + taxes
  setTotal(cartAmount, taxes, totalAmount)
}

cartService.onUpdateTotal(() => {
  updateTotal()
})

cartService.onUpdateCart(() => {
  products = []
  getCart()
})

//Confirm Payment extra validation on top of credit card library validation
$('#confirmpayment').on('click', async function () {
  if (
    $('.card-number').val().length < 19 ||
    $('.cvc').val().length < 3 ||
    $('.expiry').val().length < 7 ||
    $('#the-card-name-id').val().length < 2
  ) {
    var orderID = await cartService.checkout()
    location.replace(`./success?orderID=${orderID}`)
  }
  return false
})

getCart()
