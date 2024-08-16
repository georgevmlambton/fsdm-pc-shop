import CustomPC from '../../assets/img/home/custom_pc-s.png'

const Hero = () => {
  return (
    <div className="container-fluid cover min-vh-100 p-0">
      <div className="row justify-content-center m-0">
        <div className="col-12 col-md-6 text-light d-flex justify-content-end align-items-center py-5">
          <p>
            <span className="fs-2">Ready to level up your device?</span>
            <br />
            <span className="fs-2 fw-bold">
              LETS BUILD YOUR DREAM PCCC <br />
              TOGETHER!
            </span>
          </p>
        </div>
        <div className="col-12 col-md-6 d-flex">
          <img src={CustomPC} className="m-auto w-75" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Hero
