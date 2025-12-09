import loadTemplate from "../utils/loadTemplate.js"

const template = await loadTemplate('./components/hello-el.html')

export default class HelloElement extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('hello-element', HelloElement);