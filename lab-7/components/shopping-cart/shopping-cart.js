export default class ShoppingCart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.cart = [];
        this.render();
    }

    connectedCallback() {
        this.shadowRoot.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const id = parseInt(e.target.dataset.id);
                this.removeItem(id);
            }
            if (e.target.classList.contains('buy-btn')) {
                this.handleBuy();
            }
        });
    }

    addItem(product) {
        this.cart.push(product);
        this.render();
    }

    removeItem(id) {
        const index = this.cart.findIndex((item) => item.id === id);
        if (index !== -1) {
            const removed = this.cart.splice(index, 1)[0];
            this.dispatchEvent(
                new CustomEvent('item-removed', {
                    detail: removed,
                    bubbles: true,
                    composed: true,
                })
            );
            this.render();
        }
    }

    handleBuy() {
        const total = this.getTotal();
        this.dispatchEvent(
            new CustomEvent('purchase-completed', {
                detail: { total, items: this.cart.length },
                bubbles: true,
                composed: true,
            })
        );
        this.cart = [];
        this.render();
    }

    getTotal() {
        return this.cart.reduce((sum, item) => sum + item.price, 0);
    }

    render() {
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: sticky;
          top: 20px;
        }

        .cart {
          background: #1a1a1a;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        }

        h2 {
          font-size: 1.3rem;
          margin-bottom: 20px;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .empty {
          text-align: center;
          color: #777;
          padding: 20px;
          font-style: italic;
        }

        .items {
          max-height: 400px;
          overflow-y: auto;
          margin-bottom: 20px;
        }

        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #0d0d0d;
          border-radius: 6px;
          margin-bottom: 10px;
          border-left: 3px solid #00d4aa;
        }

        .item-name {
          flex: 1;
          font-weight: 600;
          color: #e0e0e0;
          font-size: 14px;
        }

        .item-price {
          color: #00d4aa;
          font-weight: 700;
          margin: 0 12px;
          min-width: 60px;
          text-align: right;
          font-size: 14px;
        }

        .remove-btn {
          padding: 4px 8px;
          background: #ff6b6b;
          border: none;
          border-radius: 4px;
          color: white;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: background 0.2s;
        }

        .remove-btn:hover {
          background: #ff5252;
        }

        .summary {
          border-top: 1px solid #333;
          padding-top: 16px;
          margin-bottom: 16px;
        }

        .total {
          display: flex;
          justify-content: space-between;
          font-size: 18px;
          font-weight: 700;
          color: #00d4aa;
          margin-bottom: 16px;
        }

        .buy-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #00d4aa, #00b8a9);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s;
        }

        .buy-btn:hover {
          background: linear-gradient(135deg, #00e6c3, #00d4aa);
          box-shadow: 0 8px 20px rgba(0, 212, 170, 0.3);
        }

        .buy-btn:active {
          transform: scale(0.96);
        }

        .buy-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      </style>

      <div class="cart">
        <h2>Koszyk</h2>
        
        ${
            this.cart.length === 0
                ? '<div class="empty">Koszyk jest pusty</div>'
                : `
          <div class="items">
            ${this.cart
                .map(
                    (item) => `
              <div class="item">
                <div class="item-name">${item.name}</div>
                <div class="item-price">${item.price} zł</div>
                <button class="remove-btn" data-id="${item.id}">✕</button>
              </div>
            `
                )
                .join('')}
          </div>

          <div class="summary">
            <div class="total">
              <span>Razem:</span>
              <span>${this.getTotal()} zł</span>
            </div>
            <button class="buy-btn">Kup teraz</button>
          </div>
        `
        }
      </div>
    `;
    }
}

customElements.define('shopping-cart', ShoppingCart);
