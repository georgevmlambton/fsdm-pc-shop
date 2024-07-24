const ReviewsSection = ({ product }) => {
  return (
    <div
      className="container-fluid d-inline-block bg-sup-dark mt-1 
      py-3"
      id="reviewsSection"
    >
      <div className="container d-inline-block" style={{ maxWidth: '768px' }}>
        <h2 className="mt-4 fw-bold text-light">Reviews</h2>
        <div id="reviews">
          {product ? (
            <div>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, index) => (
                  <div key={index} className="card my-2">
                    <div className="card-body">
                      <h5 className="card-title">{review.username}</h5>
                      <p className="card-text">Rating: {review.rating}</p>
                      <p className="card-text">{review.review}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card my-2">
                  <div className="card-body">
                    <p className="card-text">No Reviews Available</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Placeholder card */}
              <div className="card my-2 placeholder-glow w-100">
                <div className="card-body w-100  ">
                  {/* Placeholder title */}
                  <h5 className="card-title placeholder w-25"> </h5>
                  {/* Placeholder text lines */} <br />
                  <p className="card-text placeholder w-75"></p>
                  <p className="card-text placeholder w-75"></p>
                  <p className="card-text placeholder w-50"></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewsSection
