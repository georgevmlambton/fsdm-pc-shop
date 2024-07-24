import puppeteer from 'puppeteer'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const category = 'accessories'
const searchPage =
  'https://www.amazon.ca/s?k=keyboard+mouse&rh=n%3A677273011&ref=nb_sb_noss'

const filename = `${category}.scraped.json`

function getProductsJson() {
  if (!existsSync(filename)) {
    return {}
  }

  return JSON.parse(readFileSync(filename).toString())
}

function saveProductsJson(products) {
  writeFileSync(filename, JSON.stringify(products, null, 2))
}

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--start-maximized'],
  })

  const page = await browser.newPage()
  page.setViewport({ height: 720, width: 1280 })

  await page.goto(searchPage)

  let products = getProductsJson()

  await scrapeResults(products, browser, page)
  saveProductsJson(products)

  await (await page.waitForSelector('[aria-label="Go to page 2"]')).click()
  await scrapeResults(products, browser, page)
  saveProductsJson(products)

  await (await page.waitForSelector('[aria-label="Go to page 3"]')).click()
  await scrapeResults(products, browser, page)
  saveProductsJson(products)

  await (await page.waitForSelector('[aria-label="Go to page 4"]')).click()
  await scrapeResults(products, browser, page)
  saveProductsJson(products)
})()

async function scrapeResults(products, browser, page, attempt = 1) {
  try {
    const links = await getProductLinks(page)

    for (const link of links) {
      if (products[link.title]) {
        console.warn(`Product ${link.title} already scraped. Skipping...`)
        continue
      }

      const productPage = await browser.newPage()
      try {
        await productPage.goto(link.url)

        await productPage.waitForSelector('#productTitle', { timeout: 10_000 })
        await preloadImageThumbnails(productPage)

        const product = await productPage.evaluate(browser_ScrapeProduct)
        products[link.title] = product

        await productPage.close()
      } catch (e) {
        console.error('Failed to scrape ', link)
        productPage.close()
      }
    }
  } catch (e) {
    if (attempt < 3) {
      await page.reload()
      return scrapeResults(products, browser, page, attempt++)
    }

    console.log('Failed to scrape page')
  }

  return products
}

async function getProductLinks(page) {
  await page.waitForSelector('[data-component-type="s-search-result"]', {
    timeout: 10_000,
  })
  const links = await page.evaluate(() => {
    const results = document.querySelectorAll(
      '[data-component-type="s-search-result"]'
    )

    return Array.from(results).map((el) => {
      const href = el.querySelector('a').getAttribute('href')
      const title = el.querySelector('span.a-text-normal').innerText
      return {
        title,
        url: new URL(href, window.location.href).toString(),
      }
    })
  })

  return links
}

async function preloadImageThumbnails(productPage) {
  await productPage.waitForSelector('.item.imageThumbnail', {
    timeout: 10_000,
  })
  const imageThumbnails = await productPage.$$('.item.imageThumbnail')

  for (const thumbnail of imageThumbnails) {
    await thumbnail.hover()
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

function browser_ScrapeProduct() {
  function removeClasses(el) {
    if (el.className) {
      el.removeAttribute('class')
    }
    el.childNodes && el.childNodes.forEach(removeClasses)
  }

  function getPrice() {
    const dollars = parseInt(
      document.querySelector('.a-price-whole').innerText.replace(/[^0-9]/g, '')
    )
    const cents = parseInt(
      document.querySelector('.a-price-fraction').innerText
    )
    return dollars * 100 + cents
  }

  function getDescription() {
    const about = document.createElement('ul')
    about.innerHTML = document.querySelector('#feature-bullets > ul').innerHTML
    removeClasses(about)
    return about.outerHTML
  }

  function getReviews() {
    return Array.from(
      document.querySelectorAll('.review[data-hook="review"]')
    ).map((review) => {
      var content = review.querySelector('.reviewText > span').innerText
      var rating = parseInt(
        review
          .querySelector('.review-rating > span')
          .innerText.match(/^[0-9.]+/)[0]
      )
      return { rating, review: content }
    })
  }

  function getImages() {
    // expand each thumbnail to load their image previews so that we can scrape them
    document
      .querySelectorAll('.item.imageThumbnail')
      .forEach((thumbnail) => thumbnail.click())
    return Array.from(document.querySelectorAll('[data-old-hires]')).map((e) =>
      e.getAttribute('data-old-hires')
    )
  }

  function scrape() {
    const name = document.querySelector('#productTitle').innerText
    const price = getPrice()
    const description = getDescription()
    const images = getImages()
    const reviews = getReviews()

    return { name, price, description, images, reviews }
  }

  const product = scrape()
  return product
}
