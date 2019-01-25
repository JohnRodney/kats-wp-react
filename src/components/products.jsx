import React from 'react';
import { List } from 'react-virtualized';
import $ from 'jquery';
import Checkout from './checkout/checkout';
import convert from '../utilities/convert';
import ShoppingCartOverview from './shopping-cart/overview';
import FixedSearchBar from './shopping-cart/search-bar';
import FixedHeader from './header';


/*
 * TODO: Refactor and add this sort to improve search quality.  Need to move
 * submitting search to a button for this change
  filteredProducts.sort((a, b) => {
    const aHits = queryWords.reduce((acc, next) => {
      const hasWord = convert(a.description).toLowerCase().indexOf(next) > -1;
      const value = hasWord ? 1 : 0;
      return acc + value;
    }, 0);
    const bHits = queryWords.reduce((acc, next) => {
      const hasWord = convert(b.description).toLowerCase().indexOf(next) > -1;
      const value = hasWord ? 1 : 0;
      return acc + value;
    }, 0);
    return aHits <= bHits;
  });
 * * */

export default class Products extends React.Component {
  constructor() {
    super();
    /* cart holds the shopping cart items
     * showCart controls if the cart dropdown is visible
     * products holds all products from eforo
     * transforms holds all admin product transforms
     * query holds the user's search query
     * gettingMoreData is the status of needing more eforo items
     * * */
    this.state = {
      cart: [],
      showCart: false,
      products: [],
      transforms: [],
      query: '',
      gettingMoreData: true,
    };
    this.rowRenderer = this.rowRenderer.bind(this);
    this.updateCart = this.updateCart.bind(this);
    this.closeCart = this.closeCart.bind(this);
  }

  /* grabs the query from the url and stores is as the default search query */
  componentWillMount() {
    const query = unescape(window.location.search)
      .replace(/\?/g, '').replace(/\*/, '').split('=')[1];

    if (query) {
      this.setState({ query });
    }
  }

  /* Once everything has rendered then getProduct and transform data */
  componentDidMount() {
    this.getEforoProducts(1);
    /*
     TODO: Meteor needs replaced by wordpress backend
    Meteor.call('getTransforms', (err, transforms) => {
      if (!err) { this.setState({ transforms }); }
    });
    */
    $(window).resize(() => this.forceUpdate());
  }

  /* Call Meteor backend to retrieve data from eforo */
  getEforoProducts(page) {
    const devEndpoint = `http://localhost:8888/allpawnwp/wp-json/allpawn/v1/products?status=IN_QUEUE&page=${page}`;
    const prodEndpoint = `http://allpawn.com/wp-json/allpawn/v1/products?status=IN_QUEUE&page=${page}`;

    $.get(prodEndpoint, (res, status) => (
      this.handleProductResponse(status, JSON.parse(res), page)
    ));
    /*
    TODO: REmove this after the above is working properly
    Meteor.call('getEforoProducts', page,
      (err, res) => this.handleProductResponse(err, res, page),
    );
    */
  }

  /* Keeps reading pages of responses from Eforo and concats products to
   * state.
   * * */
  handleProductResponse(err, response, page) {
    const pageCount = response.page_count;
    const { items } = response;
    let { products } = this.state;
    products = products.concat(items);
    const gettingMoreData = page < pageCount;
    this.setState({ products, gettingMoreData });

    return gettingMoreData ? this.getEforoProducts(page + 1) : true;
  }

  closeCart() {
    this.setState({ showCheckout: false });
  }

  updateCart(cart) {
    this.setState({ cart });
  }

  rowRenderer({
    key,
    index,
    style,
  }) {
    const { products } = this.state;
    const { query } = this.state;
    /* ["some", "search", "phrase"] */
    const queryWords = query.toLowerCase().split(' ').filter(q => q !== '');
    const noQuery = queryWords.length === 0;

    const filteredProducts = noQuery ? products : [];

    queryWords.reduce((acc, next) => {
      const wordRegex = new RegExp(next.toLowerCase(), 'i');
      return acc.filter((p) => {
        const doesMatch = wordRegex.test(convert(p.description).toLowerCase());
        if (doesMatch) { filteredProducts.push(p); }
        return !doesMatch;
      });
    }, products);

    const asProduct = filteredProducts[index];
    const { transforms } = this.state;
    const asTransform = transforms.filter(prod => (
      prod && prod.characteristics && asProduct && asProduct.characteristics
      && prod.characteristics.sku === asProduct.characteristics.sku
    ));

    const isTransform = asTransform.length > 0;
    const product = isTransform ? asTransform[0] : asProduct;
    const productHasPhoto = asProduct.photo_urls.length > 0;

    const productPhoto = (
      <img
        alt={product.title}
        src={
          productHasPhoto
            ? asProduct.photo_urls[asProduct.photo_urls.length - 1]
            : product.photo_urls[product.photo_urls.length - 1]
        }
      />
    );

    const photoPlaceholder = (
      <img
        alt="missing"
        src="https://www.us.aspjj.com/sites/aspjj.com.us/files/default_images/No_available_image_3.jpg"
      />
    );

    const { cart } = this.state;

    return (
      <div
        className={`a-product ${index % 2 === 0 ? 'even' : 'odd'}`}
        key={key}
        style={style}
      >
        <div>
          <div className="image-price">
            {
              product.photo_urls.length > 0 || productHasPhoto
                ? productPhoto
                : photoPlaceholder
            }
            <h2>{`$${parseFloat(product.value).toFixed(2)}`}</h2>
          </div>
          <div className="product-content">
            <h1>{`${convert(product.characteristics.manufacturer)} ${product.characteristics.model}`}</h1>
            <h3>{convert(product.description)}</h3>
          </div>
          <div className="shopping-cart-buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => {
                const isNotInCart = cart.filter(p => (
                  p.characteristics.sku === product.characteristics.sku && product.quantity === '1'
                )).length === 0;

                if (isNotInCart) {
                  if (productHasPhoto) {
                    product.photo_urls = [asProduct.photo_urls[asProduct.photo_urls.length - 1]];
                  }
                  this.setState({ cart: cart.concat([product]) });
                }
              }}
            >
              ADD TO CART
            </button>
            <button
              type="button"
              className="add-to-cart checkout"
              onClick={() => (
                this.setState({
                  showCheckout: true,
                  showCart: false,
                  cart: cart.concat([product]),
                })
              )}
            >
              ADD AND CHECKOUT
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      showCart,
      showCheckout,
      products,
      query,
      cart,
      gettingMoreData,
      type,
    } = this.state;

    const queryWords = query.toLowerCase().split(' ').filter(q => q !== '');
    const noQuery = queryWords.length === 0;
    const filteredProducts = noQuery ? products : [];

    queryWords.reduce((acc, next) => {
      const wordRegex = new RegExp(next.toLowerCase(), 'i');
      return acc.filter((p) => {
        const doesMatch = wordRegex.test(convert(p.description).toLowerCase());
        if (doesMatch) { filteredProducts.push(p); }
        return !doesMatch;
      });
    }, products);

    const loading = products.length === 0
      || (gettingMoreData && filteredProducts.length === 0);
    const listHeight = window.innerWidth < 720 ? 500 : 300;

    return (
      <div className="page">
        {
          !showCart
            ? ''
            : (
              <ShoppingCartOverview
                openCheckout={() => this.setState({ showCheckout: true, showCart: false })}
                cart={cart}
                updateCart={c => this.setState({ cart: c })}
              />
            )
        }
        <div className="products">
          <FixedHeader />
          <FixedSearchBar
            query={query}
            setQuery={q => this.setState({ query: q })}
            gettingMoreData={gettingMoreData}
            showCart={showCart}
            toggleCart={() => this.setState({ showCart: !showCart })}
            filteredProducts={filteredProducts}
            cart={cart}
          />
          {
            loading
              ? <div className="loader">Loading...</div>
              : <div />
          }
          <List
            width={window.innerWidth}
            height={window.innerHeight}
            type={type}
            rowCount={filteredProducts.length}
            rowHeight={listHeight}
            rowRenderer={this.rowRenderer}
          />
        </div>
        {
          showCheckout
            ? (
              <Checkout
                update={this.updateCart}
                close={this.closeCart}
                cart={cart}
              />
            ) : ''
        }
      </div>
    );
  }
}
