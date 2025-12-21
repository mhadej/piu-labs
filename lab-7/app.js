import productsData from './data.json' with { type: 'json' };
import styles from './style.css' with { type: 'css' };
import './components/product-card/product-card.js';
import './components/product-list/product-list.js';
import './components/shopping-cart/shopping-cart.js';

document.adoptedStyleSheets = [styles];

const productList = document.querySelector('product-list');
const cart = document.querySelector('shopping-cart');

productList.products = productsData;

productList.addEventListener('product-added', (e) => {
  cart.addItem(e.detail);
});