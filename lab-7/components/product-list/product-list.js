export default class ProductList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .container {
          padding: 20px;
        }

        h1 {
          text-align: center;
          margin-bottom: 40px;
          font-size: 2.5rem;
          color: #fff;
          font-weight: 300;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
      </style>

      <div class="container">
        <h1>Sklep</h1>
        <div class="grid" id="grid"></div>
      </div>
    `;
    }

    set products(data) {
        this._products = data;
        this.render();
    }

    render() {
        const grid = this.shadowRoot.getElementById('grid');
        grid.innerHTML = '';

        this._products.forEach((product) => {
            const card = document.createElement('product-card');
            card.product = product;

            card.addEventListener('add-to-cart', (e) => {
                this.dispatchEvent(
                    new CustomEvent('product-added', {
                        detail: e.detail,
                        bubbles: true,
                        composed: true,
                    })
                );
            });

            grid.appendChild(card);
        });
    }
}

customElements.define('product-list', ProductList);
