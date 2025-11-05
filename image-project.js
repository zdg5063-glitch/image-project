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

    this.artworks = [];
    this.totalArtworks = 0;
    this.showGrid = true; // ✅ new

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
      imageIndex: { type: String },
      showGrid: { type: Boolean }, // ✅ new
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
          background-color: black;
          color: white;
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
          padding: 72px;
          box-sizing: border-box;
          background-color: black;
          color: white;
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
  font-family: 'Playfair Display', serif;
  font-weight: 700;    /* bold for main title */
  font-style: italic;  /* slanted like frames */
  color: white;
  font-size: 48px;
  padding-top: 0px;
  position: relative;
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
          color: white;
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
        background-color: black; /* make background black */
        color: white; /* make text white */
        cursor: pointer;
        border: 1px solid white; /* optional: add white border for visibility */
      }

        .arrow-btn {
          font-size: 50px;
          border: none;
          border-radius: 12px;
          background-color: transparent;
          color: white;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .arrow-btn:hover {
          transform: scale(1.1);
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

        /* =================Gallery grid ================== */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, 500px);
          gap: 16px;
          width: 100%;
          box-sizing: content-box;
          padding: 4px;
          background-color: black;
        }

        .frame {
          background-color: black;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          color: white;
        }

        .frame img {
          width: 475px;
          height: 375px;
          object-fit: cover;
          display: block;
        }

                /* Import Playfair Display from Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');

        .frame h4 {
          font-family: 'Playfair Display', serif;
          color: white;
          margin: 12px 6px;
          font-size: 48px;
          font-weight: 100;
          font-style: italic;         
        }

        .frame button {
          margin-top: 8px;
          padding: 8px 16px;
          font-size: 16px;  
          border-radius: 6px;
          border: 1px solid white; 
          cursor: pointer;
          background-color: black; 
          color: white;            
        }
        .archive-heading {
  font-family: 'Playfair Display', serif;
  background-color: black;
  color: white;
  text-align: center;
  font-size: 72px;
  margin: 0; /* remove white space */
  padding-top: 72px; 
}



      `,
    ];
  }

  render() {
  const currentIndex = Number(this.imageIndex) || 0;
  const currentLiked = this.artworks?.[currentIndex]?.liked || false;

  // Site-wide heading, always displayed
  const heading = html`<h1 class="archive-heading">Jean-Michel Basquiat Archive</h1>`;

// GALLERY GRID VIEW ====== LAZY LOAD
if (this.showGrid) {
  return html`
    ${heading}
    <div class="content-row">
      <div class="grid">
        ${this.artworks && this.artworks.length
          ? this.artworks.map(
              (art, i) => html`
                <div class="frame">
                  <img 
                    src="${art.image || ""}" 
                    alt="${art.title || "Untitled"}" 
                    loading="lazy" 
                  />
                  <h4>${art.title || "Untitled"}</h4>
                  <button @click=${() => this._openDetails(i)}>view details</button>
                </div>
              `
            )
          : html`<div>Loading artworks…</div>`}
      </div>
    </div>
  `;
}


// DETAIL VIEW (original layout)
return html`
  ${heading}
  <div class="content-row">
    <div class="image-container">
      <img id="image" src=${this.imageSrc} alt=${this.title} />
    </div>

    <div class="text-section">
      <div class="button-row">
        <my-like-button
          likeIndex="${this.imageIndex}"
          ?liked=${currentLiked}
          @liked=${this._handleLike}
        ></my-like-button>

        <button class="refresh-btn" @click=${this._backToGrid}>
          back to gallery
        </button>
      </div>

      <h3 id="title">${this.title}</h3>
      <div id="artist-year">
        ${this.artist ? `${this.artist}` : ""} ${this.year ? `(${this.year})` : ""}
      </div>

      <div class="description-container">
        ${this.description ? this.description : ""}
      </div>
    </div>

    <div class="imageIndex-container">
      <button class="arrow-btn" @click=${this.showPreviousArtwork}>←</button>
      <span>${this.imageIndex ? this.imageIndex : ""}</span>
      <button class="arrow-btn" @click=${this.showNextArtwork}>→</button>
    </div>
  </div>
`;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this._loadAllArtworks();
    const savedIndex = Number(localStorage.getItem("lastArtworkIndex"));
    if (!Number.isNaN(savedIndex)) {
      this.loadArtworkByIndex(savedIndex);
    } else {
      this.showGrid = true;
    }
  }

  async _loadAllArtworks() {
    try {
      const hostname = window.location.hostname;
      const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
      const url = isLocal ? "/data/basquiat.json" : "/api/basquiat";
      const resp = await fetch(url, { cache: "no-store" });
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);

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
    index = (index + 1) % this.totalArtworks;
    this.loadArtworkByIndex(index);
  }

  showPreviousArtwork() {
    if (!this.artworks?.length) return;
    let index = Number(localStorage.getItem("lastArtworkIndex"));
    if (Number.isNaN(index)) index = 0;
    index = (index - 1 + this.totalArtworks) % this.totalArtworks;
    this.loadArtworkByIndex(index);
  }

  loadArtworkByIndex(index) {
    if (!this.artworks?.length) return;
    if (index < 0) index = 0;
    if (index >= this.totalArtworks) index = 0;

    const art = this.artworks[index];
    if (!art) return;

    this.displayArtwork(art);
    this.imageIndex = index;

    localStorage.setItem("lastArtworkIndex", String(index));
    localStorage.setItem("lastArtwork", JSON.stringify(art));

    this._updateUrlWithIndex(index);
  }

  displayArtwork(art) {
    this.imageSrc = art.image || "";
    this.artist = art.artist || "";
    this.title = art.title || "Untitled";
    this.year = art.year || "";
    this.description = art.description || "";
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

  // ✅ Open the detail page for clicked frame
  _openDetails(index) {
    const idx = Number(index);
    if (Number.isNaN(idx) || !this.artworks || !this.artworks[idx]) return;
    this.showGrid = false;
    this.loadArtworkByIndex(idx);
    this.requestUpdate();
  }

  // ✅ Return to grid
  _backToGrid() {
    this.showGrid = true;
    this.requestUpdate();
  }

  _handleLike(e) {
    const { liked, index } = e.detail;
    const idx = Number(index);
    if (Number.isNaN(idx)) return;
    if (this.artworks && this.artworks[idx]) {
      this.artworks[idx].liked = liked;
    }
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(ImageProject.tag, ImageProject);
