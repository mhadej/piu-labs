import loadTemplate from '../../utils/loadTemplate.js';

const template = await loadTemplate('./components/color-list/color-list.html');

export default class ColorList extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const wrapper = this.shadowRoot.querySelector('.colors-wrapper');
        const colors = this.querySelectorAll('span[data-color]');

        colors.forEach((colorEl, index) => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'color-option';
            colorDiv.style.backgroundColor = colorEl.getAttribute('data-color');
            colorDiv.title = colorEl.textContent;

            if (index === 0) {
                colorDiv.classList.add('selected');
            }

            colorDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                wrapper
                    .querySelectorAll('.color-option')
                    .forEach((el) => el.classList.remove('selected'));
                colorDiv.classList.add('selected');
            });

            wrapper.appendChild(colorDiv);
        });

        this.querySelectorAll('span[data-color]').forEach((el) => el.remove());
    }
}

customElements.define('color-list', ColorList);
