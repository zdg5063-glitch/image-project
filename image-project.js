/**
 * Copyright 2025 zdg5063-glitch
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./my-like-button.js";
import "./my-dislike-button.js";
import "./my-share-button.js";

/**
 * `image-project`
 *
 * @demo index.html
 * @element image-project
 */
export class ImageProject extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "image-project";
  }

  constructor() {
    super();
    this.title = "";
    this.imageSrc = "";
    this.t = this.t || {};
    this.t = { ...this.t };

    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/image-project.ar.json", import.meta.url).href + "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      imageSrc: { type: String },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
          width: 500px;
          height: 550px;
          box-sizing: border-box;
          border: var(--ddd-border-lg);
          border-color: var(--ddd-theme-default-athertonViolet);
          border-radius: var(--ddd-radius-sm);
          background-color: #fafafa;
          color: var(--ddd-theme-default-coalyGray);
        }

        /* 🌙 Dark Mode */
        @media (prefers-color-scheme: dark) {
          :host {
            background-color: var(--ddd-theme-default-shrineLight);
            color: var(--ddd-theme-default-shrineLight);
            border-color: var(--ddd-theme-default-coalyGray);
          }

          .refresh-btn {
            background-color: var(--ddd-theme-default-shrineLight);
            color: var(--ddd-theme-default-coalyGray);
          }
        }

        #image {
          width: 450px;
          height: 300px;
          object-fit: cover;
          display: block;
          margin: var(--ddd-spacing-4) auto;
          border-radius: 0px;
        }

        .button-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 12px;
        }

        .refresh-btn {
          padding: 8px 16px;
          font-size: 16px;
          border: none;
          border-radius: 6px;
          background-color: var(--ddd-theme-default-inventOrange);;
          color: var(--ddd-theme-default-coalyGray);
          cursor: pointer;
        }
        #title {
          color: var(--ddd-theme-default-coalyGray);
          font-size: 24px;
          margin-top: var(--ddd-spacing-4);
          margin-bottom: var(--ddd-spacing-6);
          text-align: center;
        }

        #description {
          font-family: var(--dd-font-navigation);
          font-size: 16px;
          text-align: center;
          margin-top: 12px;
          color: var(--ddd-theme-default-coalyGray);
          padding: 24px;
          padding-top: 4px;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="wrapper">
        <h3 id="title">RANDOM FOXES</h3>

        <img id="image" src=${this.imageSrc} alt="Random Fox" />

        <div class="button-row">
          <my-like-button></my-like-button>
          <my-dislike-button></my-dislike-button>
          <my-share-button></my-share-button>
          <button class="refresh-btn" @click=${this.fetchNewImage}>New Fox</button>
        </div>

        <p id="description">
          This is a random fox generator. Click the New Fox button to see a random new fox.
        </p>
      </div>
    `;
  }

  firstUpdated() {
    this.fetchNewImage(); // Load first image
  }

  async fetchNewImage() {
    try {
      const resp = await fetch("https://randomfox.ca/floof/");
      if (!resp.ok) return;
      const data = await resp.json();
      if (data && data.image) {
        this.imageSrc = data.image;
      }
    } catch (e) {
      console.error("Error fetching fox image:", e);
    }
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(ImageProject.tag, ImageProject);
