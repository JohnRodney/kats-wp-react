import PropTypes from 'prop-types';
import React from 'react';
import Product from './product';

export default function CheckoutProducts(props) {
  const { cart, total, update } = props;

  return (
    <div className="checkout-products">
      <h1 className="your-items">Your Items</h1>
      {
        cart.map(p => (
          <Product
            key={`${p.characteristics.sku}`}
            p={p}
            cart={cart}
            update={update}
          />
        ))
      }
      <div className="checkout-total">
        {`Total Purchase Amount: ${total}`}
      </div>
    </div>
  );
}

const {
  any, arrayOf, number, shape, string, func,
} = PropTypes;

CheckoutProducts.propTypes = {
  total: PropTypes.string.isRequired,
  cart: arrayOf(shape({
    category_id: string.isRequired,
    channels: arrayOf(string.isRequired).isRequired,
    characteristics: shape({
      condition: string.isRequired,
      manufacturer: string.isRequired,
      model: string.isRequired,
      sku: string.isRequired,
      upc: string.isRequired,
    }).isRequired,
    consignor_id: string.isRequired,
    cost: any,
    description: string.isRequired,
    dimensions: string.isRequired,
    external_id: string.isRequired,
    in_store_location: string.isRequired,
    inventory_id: string.isRequired,
    photo_urls: arrayOf(string.isRequired).isRequired,
    product_category: string.isRequired,
    quantity: string.isRequired,
    serial_number: any,
    status: string.isRequired,
    tags: arrayOf(any).isRequired,
    title: string.isRequired,
    value: string.isRequired,
    weight: number.isRequired,
  }).isRequired).isRequired,
  update: func.isRequired,
};
