const Footer = () => {
  return (
    <>
      <div
        id="footer"
        className="container-fluid bg-sdown-dark py-3 text-light vh-30"
      >
        <div className="container mt-3">
          <div className="row">
            <div className="col">
              <span className="fw-medium fs-4">PC SHOP </span>
              <p className="fw-light">
                Your trusted destination for all things PC: Unleash your digital
                potential with us.
              </p>
            </div>
            <div className="col d-flex justify-content-around fw-light">
              <a href="#">
                <span className="px-2">Terms & Condition</span>
              </a>
              <a href="#">
                <span className="px-2">Privacy Policy</span>
              </a>
              <a href="#">
                <span className="px-2">FAQ</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid bg-sdown-dark p-3 d-flex justify-content-center text-light">
        <div className="container">
          <hr className="border border-2 rounded" />
          <div className="row">
            <div className="text-start col-6" style={{ fontSize: '12px' }}>
              Please note that this is a dummy website used for educational
              purposes as part of our full-stack development course in Lambton
              College Mississauga, ON. By no means is this website used/will be
              used to conduct any form of ecommerce or sales.
            </div>
            <div className="text-end col-6">
              &copy; 2023 - PC Parts Project Lambton
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
