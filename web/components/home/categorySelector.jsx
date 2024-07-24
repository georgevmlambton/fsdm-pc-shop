import cpu from '../../assets/img/home/c-icons/cpu.png'
import gpu from '../../assets/img/home/c-icons/GPU.png'
import ram from '../../assets/img/home/c-icons/ram.png'
import cases from '../../assets/img/home/c-icons/cases.png'
import storage from '../../assets/img/home/c-icons/storage.png'
import power from '../../assets/img/home/c-icons/power.png'
import monitor from '../../assets/img/home/c-icons/monitor.png'
import keyboard from '../../assets/img/home/c-icons/keyboard.png'

const categories = [
  { href: '#', name: 'All', img: null },
  { href: '#', name: 'CPU', img: cpu },
  { href: '#', name: 'GPU', img: gpu },
  { href: '#', name: 'Memory', img: ram },
  { href: '#', name: 'Cases', img: cases },
  { href: '#', name: 'Storage', img: storage },
  { href: '#', name: 'Power', img: power },
  { href: '#', name: 'Monitor', img: monitor },
  { href: '#', name: 'Accessories', img: keyboard },
]

const Category = ({ href, name, img }) => {
  return (
    <a
      href={href}
      style={{ justifyContent: 'center' }}
      className="col-3 col-md-2 d-flex flex-column align-items-center p-2 mx-1 border text-decoration-none text-light bg-sdown-dark rounded-4 "
    >
      {img ? <img src={img} className="c-icon" alt={name} /> : null}
      {name}
    </a>
  )
}

const CategorySelector = () => {
  return (
    <div className="container py-3">
      <div className="fs-2 fw-medium my-3">Browse By Category</div>
      <div className="p-3 d-flex flex-row overflow-x-auto text-center">
        {categories.map((category, index) => (
          <Category {...category} key={index} />
        ))}
      </div>
    </div>
  )
}

export default CategorySelector
