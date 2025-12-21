import loadTemplate from '../../utils/loadTemplate.js';

const template = await loadTemplate(
    './components/product-card/product-card.html'
);

export default class ProductCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }

    set product(value) {
        this._product = value;
        this.render();
    }

    get product() {
        return this._product;
    }

    connectedCallback() {
        const btn = this.shadowRoot.querySelector('.add-to-cart');
        btn.addEventListener('click', () => this.handleAddToCart());
    }

    render() {
        const img = this.shadowRoot.querySelector('img');
        const name = this.shadowRoot.querySelector('.name');
        const price = this.shadowRoot.querySelector('.price');

        if (this._product) {
            img.src = this._product.image;
            img.alt = this._product.name;
            name.textContent = this._product.name;
            price.textContent = `${this._product.price} zł`;
        }
    }

    handleAddToCart() {
        this.dispatchEvent(
            new CustomEvent('add-to-cart', {
                detail: {
                    id: this._product.id,
                    name: this._product.name,
                    price: this._product.price,
                },
                bubbles: true,
                composed: true,
            })
        );
    }
}

customElements.define('product-card', ProductCard);
