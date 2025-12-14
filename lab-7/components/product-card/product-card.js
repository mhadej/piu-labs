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

    connectedCallback() {
        const promoContent = this.querySelector('[slot="promo"]');
        const promoEl = this.shadowRoot.querySelector('.promo');

        if (!promoContent || !promoContent.textContent.trim()) {
            promoEl.style.display = 'none';
        }
    }
}

customElements.define('product-card', ProductCard);
