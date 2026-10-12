import './Home.css';
import hero from '../assets/img/hero.png';
import Product from './Product';

function Home() {
  return (
    <div className="home">
        <div className="home__container">
          <img className='home__image' src={hero} />
          <div className="home__row">
            <Product></Product>
            <Product></Product>
          </div>
          <div className="home__row">
            {/* Product */}
            {/* Product */}
            {/* Product */}
          </div>
          <div className="home__row">
            {/* Product */}
          </div>
        </div>
    </div>
  )
}

export default Home