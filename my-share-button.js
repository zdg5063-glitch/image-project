import { html, css, LitElement } from 'lit';
import { DDDSuper } from '@haxtheweb/d-d-d/d-d-d.js';

export class ShareButton extends DDDSuper(LitElement) {
  static get properties() {
    return {
      shared: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.shared = false;
    
  }

  static get styles() {
    return [
      super.styles,
      css`
        button {
          background: none;
          border: none;
          margin: 12px;
          font-size: 24px;
          cursor: pointer;
        }

        button:hover {
          transform: scale(1.1);
        }

        :host([shared]) button {
          color: red;
        }
      `
    ];
  }

  handleClick() {
    this.shared = !this.shared;
    this.dispatchEvent(new CustomEvent("shared", { detail: { shared: this.shared } }));
  }

  render() {
    return html`
      <button @click=${this.handleClick}>📤</button>
    `;
  }
}

customElements.define("my-share-button", ShareButton);
