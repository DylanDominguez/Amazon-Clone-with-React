import './Product.css';
import product1 from '../assets/img/products/product-1.webp';

function Product() {
  return (
    <div className="product">
        <div className="product__info">
            <p>The Lean Startup: How Constant Innovation Creates Radically Successful Businesses Paperback</p>
            <p className="product__price">
                <small>$</small>
                <strong>19.99</strong>
            </p>
            <div className="product__rating">
                <p>🌟</p>
                <p>🌟</p>
                <p>🌟</p>
            </div>
        </div>
        <img src={product1}/>
        <button>Add to Basket</button>
    </div>
  )
}

export default Product