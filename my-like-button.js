import { html, css, LitElement } from 'lit';
import { DDDSuper } from '@haxtheweb/d-d-d/d-d-d.js';

export class LikeButton extends DDDSuper(LitElement) {
  static get properties() {
    return {
      liked: { type: Boolean, reflect: true },
      likeIndex: { type: String }
    };
  }

  constructor() {
    super();
    this.liked = false;
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

        :host([liked]) button {
          color: red;
        }

        span {
          margin-left: 8px;
          font-size: 18px;
        }
      `
    ];
  }

  handleClick() {
    this.liked = !this.liked;
    this.dispatchEvent(
      new CustomEvent("liked", { 
        detail: { liked: this.liked, count: this.likeCount },
      bubbles: true,
      composed: true 
    })
  );
  }

  render() {
    return html`
      <button @click=${this.handleClick}>
        ${this.liked ? '❤️' : '🤍'} <span>${this.likeCount}</span>
      </button>
    `;
  }
}

customElements.define("my-like-button", LikeButton);
