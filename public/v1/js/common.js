async function updateCart() {
  var cartCount = await cartService.getCartItemsCount()
  if (cartCount) {
    $('#cart-count').show().text(cartCount)
  } else {
    $('#cart-count').hide()
  }
}

async function setUpNavbar() {
  $('header').load('components/navbar.html', function () {
    cartService.onUpdateCart(updateCart)
    updateCart()
  })

  // set CSS classes on header
  $('header').addClass('sticky-top nav-bar')

  // adjust navbar style on scroll
  $(window).scroll(function () {
    var $navbar = $('.nav-bar').children('.navbar')
    var scroll = $(window).scrollTop()
    if (scroll > 20) {
      $navbar.removeClass('bg-sup-dark').addClass('bg-sdown-dark')
    } else {
      $navbar.removeClass('bg-sdown-dark').addClass('bg-sup-dark')
    }
  })
}

function setUpFooter() {
  $('footer').load('components/footer.html')
}

setUpNavbar()
setUpFooter()
