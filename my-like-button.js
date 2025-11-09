import { LitElement, html, css } from "lit";

export class MyLikeButton extends LitElement {
  static get tag() {
    return "my-like-button";
  }

  static get properties() {
    return {
      liked: { type: Boolean },
      likeIndex: { type: Number },
    };
  }

  constructor() {
    super();
    this.liked = false;
    this.likeIndex = 0;
  }

  _toggleLike() {
    this.liked = !this.liked;
    this.dispatchEvent(
      new CustomEvent("liked", {
        detail: { liked: this.liked, index: this.likeIndex },
        bubbles: true,
        composed: true,
      })
    );
  }

  static get styles() {
    return css`
      button {
        background-color: black;
        height: 36px;
        width: 86px;
        color: white;
        border: 1px solid white;
        border-radius: 6px;
        padding: 6px 12px;
        cursor: pointer;
      }
      button:hover {
        background-color: white;
        color: black;
      }
    `;
  }

  render() {
    return html`
      <button @click=${this._toggleLike}>
        ${this.liked ? "❤️ Liked" : "♡ Like"}
      </button>
    `;
  }
}

customElements.define(MyLikeButton.tag, MyLikeButton);
