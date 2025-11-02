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
    this.artist = "";
    this.year = "";
    this.imageSrc = "";
    this.description = "";
    this.imageIndex = 0;


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
      artist: { type: String },
      year: { type: String },
      imageSrc: { type: String },
      description: { type: String },
      imageIndex: { type: String }
    };
  }


  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100vw;
          height: auto;
          min-height: 100vh;
          box-sizing: border-box;
          background: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.8));
          color: var(--ddd-theme-default-coalyGray);
        }

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

        .content-row {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 32px;
          width: 100%;
          padding: 100px;
          box-sizing: border-box;
        }

        .buttons {
          display: flex;
          justify-content: center;
        }

        .image-container {
          flex: 1;
          max-width: 50%;
          height: 800px;
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          overflow: hidden;
        }

        .image-container img {
          width: auto;
          max-width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: top right;
          display: block;
        }

        .text-section {
          flex: 1;
          text-align: left;
          color: white;
          max-width: 100%;
        }

        #title {
          padding-top: 0px;
          position: relative;
          font-size: 48px;
          font-weight: 900;
        }

        #artist-year {
          font-size: 24px;
          margin-bottom: 12px;
          font-weight: 200;
        }

        .description-container {
          font-size: 14px;
          letter-spacing: 2px;
          font-weight: 100;
          color: white;
          column-fill: auto;
          width: 100%;
          max-height: 500px;
          overflow-y: auto;
          text-align: left;
        }

        .imageIndex-container {
          font-size: 24px;
          font-weight: 500;
        }

        .button-row {
          display: flex;
          gap: 12px;
          justify-content: left;
        }

        .refresh-btn {
          padding: 8px 16px;
          font-size: 16px;
          border: none;
          border-radius: 6px;
          background-color: var(--ddd-theme-default-inventOrange);
          color: var(--ddd-theme-default-coalyGray);
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .content-row {
            flex-direction: column;
            align-items: center;
            padding: 32px;
          }

          .image-container {
            max-width: 100%;
            height: auto;
            justify-content: center;
            align-items: center;
          }

          .image-container img {
            width: 100%;
            height: auto;
            object-fit: contain;
            object-position: center;
          }

          .text-section {
            max-width: 100%;
            text-align: center;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="content-row">
        <div class="image-container">
          <img id="image" src=${this.imageSrc} alt=${this.title} />
        </div>

        <div class="text-section">
          <div class="button-row">
            <button class="refresh-btn" @click=${this.showNextArtwork}>
              New Basquiat
            </button>
            <my-like-button></my-like-button>
            <my-dislike-button></my-dislike-button>
            <my-share-button></my-share-button>
          </div>

          <h3 id="title">${this.title}</h3>
          <div id="artist-year">
            ${this.artist ? `${this.artist}` : ""}
            ${this.year ? `(${this.year})` : ""}
          </div>

          <div class="description-container">
            ${this.description ? this.description : ""}
          </div>
        </div>
        <div class="imageIndex-container">
          ${this.imageIndex ? this.imageIndex : ""}
        </div>
      </div>
    `;
  }

  // ============================================================
  // MAIN LOGIC
  // ============================================================

  async connectedCallback() {
    super.connectedCallback();
    await this._loadAllArtworks();
    const savedIndex = Number(localStorage.getItem("lastArtworkIndex"));
    if (!Number.isNaN(savedIndex)) {
      this.loadArtworkByIndex(savedIndex);
    } else {
      this.showNextArtwork();
    }
  }

  async _loadAllArtworks() {
    try {
      const resp = await fetch("./basquiat.json", { cache: "no-store" });
      const data = await resp.json();
      this.artworks = data.artworks || [];
      this.totalArtworks = this.artworks.length;
    } catch (err) {
      console.error("Error loading artworks:", err);
      this.artworks = [];
      this.totalArtworks = 0;
    }
  }

  showNextArtwork() {
    if (!this.artworks?.length) return;

    let index = Number(localStorage.getItem("lastArtworkIndex"));
    if (Number.isNaN(index)) index = -1;

    // Wrap around cleanly after the last image
    index = (index + 1) % this.totalArtworks;

    this.loadArtworkByIndex(index);
  }

  loadArtworkByIndex(index) {
    if (!this.artworks?.length) return;

    // Clamp index to valid range
    if (index < 0) index = 0;
    if (index >= this.totalArtworks) index = 0;

    const art = this.artworks[index];
    if (!art) return;

    this.displayArtwork(art);
    this.imageIndex = index;

    // Save to localStorage for persistence
    localStorage.setItem("lastArtworkIndex", String(index));
    localStorage.setItem("lastArtwork", JSON.stringify(art));

    this._updateUrlWithIndex(index);
    console.log(`Displayed artwork #${index + 1}: ${art.title}`);
  }

  displayArtwork(art) {
    this.imageSrc = art.image || "";
    this.artist = art.artist || "";
    this.title = art.title || "Untitled";
    this.year = art.year || "";
    this.description = art.description || "";
    this.imageIndex = (this.imageIndex ?? 0) + 1;
  }

  _updateUrlWithIndex(index) {
    try {
      const params = new URLSearchParams(window.location.search);
      params.set("artIndex", String(index));
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      history.replaceState(null, "", newUrl);
    } catch (err) {
      console.warn("Could not update URL with art index:", err);
    }
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(ImageProject.tag, ImageProject);
