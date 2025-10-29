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
  height: auto;  /* allow it to grow with content */
  min-height: 100vh; /* still at least fill the viewport */
  box-sizing: border-box;
  background: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.8));
  color: white;
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
          max-width: 45%;
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
          width: 90%;
          max-height: 400px;
          overflow-y: auto;
          text-align: left;
        }

        .imageIndex-container {
        font-size: 24px;
     padding-right: 72px;
        font-weight: 100;
        }

        /* Button container with fixed height so buttons don't move */
        .button-wrapper {
          height: 50px; /* 600px max image + 50px spacing */
          display: flex;
          align-items: center;
          padding-left: 72px;
        }

        .button-row {
        position: fixed;      
        align-items: right;
        bottom: 150px;        
        left: 800px;          
        display: flex;
        gap: 12px;           
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

        @media (max-width: 800px) {
          .content-row {
            flex-direction: column;
            text-align: center;
          }

          .image-container,
          .text-section {
            max-width: 100%;
          }

          .description-container {
            column-count: 1;
          }

          .button-wrapper {
            justify-content: center;
            padding-left: 0;
          }
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
      </div>

      <!-- Button wrapper ensures buttons stay fixed below the max-height image -->
      <div class="button-wrapper">
        <div class="button-row">
          <my-like-button></my-like-button>
          <my-dislike-button></my-dislike-button>
          <my-share-button></my-share-button>
          <button class="refresh-btn" @click=${this.fetchNewImage}>
            New Basquiat
          </button>
        </div>
      </div>
    `;
  }

// *****************************************************************************
// URL shit from chatgpt

firstUpdated() {
  try {
    const savedIndex = Number(localStorage.getItem("lastArtworkIndex"));
    if (!Number.isNaN(savedIndex)) {
      this.loadArtworkByIndex(savedIndex);
      return;
    }
    this.fetchNewImage(); // start fresh if nothing saved
  } catch (err) {
    console.warn("Error loading initial artwork:", err);
    this.fetchNewImage();
  }
}

async fetchNewImage() {
  try {
    const resp = await fetch("./basquiat.json", { cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const data = await resp.json();
    if (!data?.artworks?.length) throw new Error("Invalid JSON data");

    const total = data.artworks.length;

    // Load saved index or start at 0
    let index = this.imageIndex ?? 0;
    const savedIndex = Number(localStorage.getItem("lastArtworkIndex"));
    if (!Number.isNaN(savedIndex)) index = savedIndex;

    // Move to next artwork sequentially
    index = (index + 1) % total;

    // Display and track artwork
    const art = data.artworks[index];
    this.displayArtwork(art);
    this.imageIndex = index;

    // Save index + artwork to localStorage
    localStorage.setItem("lastArtworkIndex", String(index));
    localStorage.setItem("lastArtwork", JSON.stringify(art));

    // Update URL
    this._updateUrlWithIndex(index);

    console.log(`Displayed artwork #${index + 1} of ${total}: ${art.title}`);
  } catch (err) {
    console.error("Error fetching new image:", err);
  }



    const art = data.artworks[randomIndex];
    this.displayArtwork(art);
    this._currentArtIndex = randomIndex;
    this._updateUrlWithIndex(randomIndex);

    // Save to localStorage
    localStorage.setItem("lastArtwork", JSON.stringify(art));

    console.log("Fetched new random artwork:", art.title);
  } catch (err) {
    console.error("Error fetching new image:", err);
  }


async loadArtworkByIndex(index) {
  try {
    const resp = await fetch("./basquiat.json", { cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const data = await resp.json();
    if (!data?.artworks?.length) throw new Error("Invalid JSON data");

    if (index < 0 || index >= data.artworks.length) {
      console.warn("Invalid artIndex, falling back to first image");
      this.fetchNewImage();
      return;
    }

    const art = data.artworks[index];
    this.displayArtwork(art);
    this.imageIndex = index;
    this._updateUrlWithIndex(index);

    localStorage.setItem("lastArtworkIndex", String(index));
    localStorage.setItem("lastArtwork", JSON.stringify(art));

    console.log("Loaded artwork by index:", art.title);
  } catch (err) {
    console.error("Error loading by index:", err);
    this.fetchNewImage();
  }
}


displayArtwork(art) {
  this.imageSrc = art.image || "";
  this.artist = art.artist || "";
  this.title = art.title || "Untitled";
  this.year = art.year || "";
  this.description = art.description || "";
  this.imageIndex = art.imageIndex || "";
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
