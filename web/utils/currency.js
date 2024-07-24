export const parsePrice = (price) => {
  const priceInDollars = price / 100
  return (
    'C' +
    new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(priceInDollars)
  )
}
