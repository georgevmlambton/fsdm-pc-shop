var urlParams = new URLSearchParams(window.location.search)
var productID = parseInt(urlParams.get('id'))
var stockCount
function populateReview(reviewElement, username, rating, content) {
  $(reviewElement).find('.username').html(username)
  $(reviewElement)
    .find('.rating')
    .html('Rating: ' + rating)
  $(reviewElement).find('.content').html(content)
}

async function loadReview(reviews) {
  //!reviews didn't work smfh
  if (reviews.length === 0) {
    $('#reviews').append(
      "<p style='color: white;'> There are currently no reviews."
    )
    return
  }
  const template = await $.get('components/reviews.html')
  reviews.forEach((review) => {
    const reviewElement = $.parseHTML(template)
    populateReview(reviewElement, review.username, review.rating, review.review)
    $('#reviews').append(reviewElement)
  })
}

$('.increaseQuantity').click(function (e) {
  e.preventDefault()
  var quantity = parseInt($('#quantity').val())
  if (quantity + 1 > stockCount) return
  $('#quantity').val(quantity + 1)
  if (quantity + 1 > 1) {
    $('.decreaseQuantity').prop('disabled', false)
  }
})

$('.decreaseQuantity').click(function (e) {
  e.preventDefault()
  var quantity = parseInt($('#quantity').val())
  if (quantity > 1) {
    $('#quantity').val(quantity - 1)
  }

  if (quantity === 1) {
    $(this).prop('disabled', true)
  }
})

$('.addToCart').click(async function (e) {
  e.preventDefault()
  if (stockCount === 0) {
    toastFail('Sorry, out of Stock')
    return
  }
  if (
    Number($('#quantity').val()) + cartService.getQuantity(productID) >
    stockCount
  ) {
    toastFail("You've bought the whole damn thing bruh")
    return
  }
  var quantity = parseInt($('#quantity').val())
  await cartService.addToCart(productID, quantity)
  toastSuccess('Added to cart!')
})

async function getProduct() {
  $('.loader').show()
  $('.loaded').hide()
  const product = await productService.getProduct(parseInt(productID))
  if (!product) {
    window.location.replace('/404')
  }
  stockCount = product.stock
  renderProduct(product)
  $('.loader').hide()
  $('.loaded').show()
}

function renderProduct(product) {
  $('.product-title').text(product.name)
  $('.description-details').html(product.description)
  $('.price').text(productService.renderPrice(product.price))
  $('.stockCount').text(product.stock + ' left in stock')
  loadImages(product.image, product.alt_images)
  loadReview(product.reviews)
}

function toastSuccess(message) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(
    $('#liveToastSuccess')
  )
  $('.toast-text-success').text(message)
  toastBootstrap.show()
}

function toastFail(message) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(
    $('#liveToastFail')
  )
  $('.toast-text-fail').text(message)
  toastBootstrap.show()
}

async function loadImages(image, alt_images) {
  const template = await $.get('components/carousel-items.html')
  let allImages = [image]
  alt_images.forEach((image) => {
    allImages.push(image)
  })

  allImages.forEach((image, index) => {
    imageTemplate = $.parseHTML(template)
    populateImages(imageTemplate, image, index)
    $('#carousel-items').append(imageTemplate)
  })
}

function populateImages(imageElement, img, index) {
  $(imageElement).find('img').attr('src', img)
  if (index === 0) $(imageElement).find('.child').parent().addClass('active')
  // Yes, the code above on line 124 is written stupidly, but it's the only way it worked
  // since $('.carousel-item') refused to work, so I couldn't select the tag I needed in
  // components/carousel-items.html
}

getProduct()
