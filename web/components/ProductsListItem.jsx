import { Link } from 'react-router-dom'

export default function ProductListItem({ id, img, productName, price }) {
  return (
    <>
      <div className="col">
        <div className="bg-sdown-dark h-100 overflow-hidden d-flex flex-column">
          <Link
            className="product-link text-decoration-none h-100 d-flex flex-column"
            to={`/product/${id}`}
          >
            <div
              className="overflow-hidden d-flex justify-content-center p-1"
              style={{ aspectRatio: '1 / 1', backgroundColor: '#fff' }}
            >
              {/* img dimensions adjusted here */}
              <img
                className="image-placeholder img-fluid"
                src={img}
                style={{
                  maxWidth: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                alt="Product Image"
              />
            </div>
            <div className="product-name text-light two-line-ellipsis">
              {productName}
            </div>
            <div className="product-price p-2 text-light fw-bold mt-auto border border-dark">
              {price}
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}
