import PropTypes from 'prop-types';
import React from 'react';
import convert from '../../utilities/convert';

export default function CheckoutProduct(props) {
  const { p, cart, update } = props;
  const defaultImage = 'https://www.us.aspjj.com/sites/aspjj.com.us/files/default_images/No_available_image_3.jpg';
  const hasPhotos = p.photo_urls.length > 0;

  const ProductImage = hasPhotos
    ? <img alt={p.title} src={p.photo_urls[0]} />
    : <img alt="missing" src={defaultImage} />;

  return (
    <div className="cart-item">
      { ProductImage }
      <span className="title">
        {
          `
            ${convert(p.characteristics.manufacturer)}
            : ${p.characteristics.model}
          `
        }
      </span>
      <span className="value">
        {`$${(+p.value).toFixed(2)}`}
      </span>
      <span className="description">{convert(p.description)}</span>
      <button
        type="button"
        className="remove-item"
        onClick={
          () => update(cart.filter(prod => prod.characteristics.sku !== p.characteristics.sku))
        }
      >
        REMOVE
      </button>
    </div>
  );
}

const {
  any, arrayOf, number, shape, string, func,
} = PropTypes;

CheckoutProduct.propTypes = {
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
  p: shape({
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
  }).isRequired,
};
