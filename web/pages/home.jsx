import CategorySelector from '../components/home/categorySelector.jsx'
import Hero from '../components/home/hero.jsx'
import advert from '../assets/img/home/ad.png'
import FeaturedProducts from '../components/home/featuredProducts.jsx'

export function Home() {
  return (
    <>
      <Hero />
      <CategorySelector />
      <FeaturedProducts />

      <div className="container-fluid bg-sup-dark p-3 d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex justify-content-center">
          <img src={advert} className="w-75 rounded" alt="" />
        </div>
      </div>
    </>
  )
}
