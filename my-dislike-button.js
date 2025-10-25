import { html, css, LitElement } from 'lit';
import { DDDSuper } from '@haxtheweb/d-d-d/d-d-d.js';

export class DislikeButton extends DDDSuper(LitElement) {
  static get properties() {
    return {
      disliked: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.disliked = false;
  }

  static get styles() {
    return [
      super.styles,
      css`
        button {
          background: none;
          border: none;
          padding: 0;
          margin: 12px;
          cursor: pointer;
          font-size: 24px;
          transition: transform 0.2s ease, color 0.3s ease;
        }

        button:hover {
          transform: scale(1.1);
        }

        :host([disliked]) button {
          color: red;
        }
      `
    ];
  }

  handleClick() {
    this.disliked = !this.disliked;
    this.dispatchEvent(new CustomEvent("disliked", { detail: { disliked: this.disliked } }));
  }

  render() {
    return html`
      <button @click=${this.handleClick}>👎</button>
    `;
  }
}

customElements.define("my-dislike-button", DislikeButton);
