import './Home.css';
import hero from '../assets/img/hero.png';
import Product from './Product';
import product1 from '../assets/img/products/product-1.webp';
import product2 from '../assets/img/products/product_2.jpg';
import product3 from '../assets/img/products/product_3.jpg';
import product4 from '../assets/img/products/product_4.jpg';
import product5 from '../assets/img/products/product_5.jpg';
import product6 from '../assets/img/products/product_6.webp';

function Home() {
  return (
    <div className="home">
        <div className="home__container">
          <img className='home__image' src={hero} />
          <div className="home__row">
            <Product title='The Lean Startup: How Constant Innovation Creates Radically Successful Businesses Paperback' price={29.99} image={product1} rating={3}></Product>
            <Product title='Smoothie Blender Grinder Combo, Countertop Blender Smoothies and Shakes' price={171.61} image={product2} rating={4}></Product>
          </div>
          <div className="home__row">
            <Product title='Astercook Juego de 19 ollas y sartenes antiadherentes, juego de utensilios de cocina de inducción de titanio negro, juego de cocina saludable no tóxico con sartenes, PTFE PFOA PFOS libre, regalo del día del padre para hombres' price={274.60} image={product3} rating={5}></Product>
            <Product title='Ninja Licuadora Professional Plus, Auto-iQ, 1400W, jarra de 72 onzas, BN701' price={308.93} image={product4} rating={3}></Product>
            <Product title='Puma Paquete de 4 camisetas de algodón de manga corta con cuello redondo para hombre' price={111.98} image={product5} rating={4}></Product>
          </div>
          <div className="home__row">
            <Product title='Samsung Serie M70H de 55 pulgadas, mini LED, 4K, Smart TV, modelo 2026' price={3254.76} image={product6} rating={5}></Product>
          </div>
        </div>
    </div>
  )
}

export default Home