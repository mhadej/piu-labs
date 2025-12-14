import loadTemplate from '../../utils/loadTemplate.js';

const template = await loadTemplate('./components/size-list/size-list.html');

export default class SizeList extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const wrapper = this.shadowRoot.querySelector('.sizes-wrapper');
        const sizes = this.querySelectorAll('span');

        sizes.forEach((sizeEl, index) => {
            const sizeBtn = document.createElement('button');
            sizeBtn.className = 'size-option';
            sizeBtn.textContent = sizeEl.textContent;

            if (index === 0) {
                sizeBtn.classList.add('selected');
            }

            sizeBtn.addEventListener('click', (e) => {
                //event bubbling
                e.stopPropagation();

                wrapper
                    .querySelectorAll('.size-option')
                    .forEach((el) => el.classList.remove('selected'));
                sizeBtn.classList.add('selected');
            });

            wrapper.appendChild(sizeBtn);
        });

        this.querySelectorAll('span').forEach((el) => el.remove());
    }
}

customElements.define('size-list', SizeList);
