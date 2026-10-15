import React from 'react'
import './Checkout.css';
import checkout from '../assets/img/checkout.jpg';
import Subtotal from './Subtotal';

function Checkout() {
  return (
    <div className='checkout'>
        <div className="checkout__left">
          <img className='checkout__ad' src={checkout} alt="" />

          <div>
            <h2 className="checkout__title">
              Your shopping Basket
            </h2>
            {/* BasketItem */}
          </div>
        </div>

        <div className="checkout__right">
          <Subtotal />
        </div>
    </div>
  )
}

export default Checkout