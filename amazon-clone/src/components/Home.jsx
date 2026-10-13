import './Home.css';
import hero from '../assets/img/hero.png';
import Product from './Product';
import product1 from '../assets/img/products/product-1.webp';

function Home() {
  return (
    <div className="home">
        <div className="home__container">
          <img className='home__image' src={hero} />
          <div className="home__row">
            <Product title='The Lean Startup: How Constant Innovation Creates Radically Successful Businesses Paperback' price={29.99} image={product1} rating={3}></Product>
            <Product title='The Lean Startup: How Constant Innovation Creates Radically Successful Businesses Paperback' price={29.99} image={product1} rating={3}></Product>
          </div>
          <div className="home__row">
            <Product title='The Lean Startup: How Constant Innovation Creates Radically Successful Businesses Paperback' price={29.99} image={product1} rating={3}></Product>
            <Product title='The Lean Startup: How Constant Innovation Creates Radically Successful Businesses Paperback' price={29.99} image={product1} rating={3}></Product>
            <Product title='The Lean Startup: How Constant Innovation Creates Radically Successful Businesses Paperback' price={29.99} image={product1} rating={3}></Product>
          </div>
          <div className="home__row">
            <Product title='The Lean Startup: How Constant Innovation Creates Radically Successful Businesses Paperback' price={29.99} image={product1} rating={3}></Product>
          </div>
        </div>
    </div>
  )
}

export default Home