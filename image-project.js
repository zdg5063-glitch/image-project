/**
 * Copyright 2025 zdg5063-glitch
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./my-like-button.js";
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

  //CONSTRUCTOR
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
    this.showGrid = true; 

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
      showGrid: { type: Boolean }, 
    };
  }

  




//CAN VIEW IN NPM START AND VERCEL
async _loadAllArtworks() {
  const url =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "/data/basquiat.json"
      : "/api/basquiat";

  try {
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






// LOAD ARTWORK BY INDEX 
_showCurrentIndex() {
  const savedIndex = Number(localStorage.getItem("lastArtworkIndex"));
  return Number.isNaN(savedIndex) ? 0 : savedIndex;
}

showNextArtwork() {
  if (!this.artworks?.length) return;
  const index = (this._showCurrentIndex() + 1) % this.totalArtworks;
  this.loadArtworkByIndex(index);
}

showPreviousArtwork() {
  if (!this.artworks?.length) return;
  const index = (this._showCurrentIndex() - 1 + this.totalArtworks) % this.totalArtworks;
  this.loadArtworkByIndex(index);
}

loadArtworkByIndex(index) {
  if (!this.artworks?.length) return;

  index = Math.max(0, Math.min(index, this.totalArtworks - 1));

  const art = this.artworks[index];
  if (!art) return;

  this.displayArtwork(art);
  this.imageIndex = index;

  localStorage.setItem("lastArtworkIndex", String(index));
  localStorage.setItem("lastArtwork", JSON.stringify(art));

  this._updateUrlWithIndex(index);
}



  //DISPLAY PAINTING, ARTIST NAME, PAINTING TITLE, YEAR, DESCRIPTION, PRICE, MEDIUM, DIMENSIONS
  displayArtwork(art) {
    this.imageSrc = art.image || "";
    this.artist = art.artist || "";
    this.title = art.title || "Untitled";
    this.year = art.year || "";
    this.description = art.description || "";
    this.price = art.price || "Undisclosed";
    this.medium = art.medium || "Undisclosed";
    this.dimensions = art.dimensions || "Undisclosed";
  }


  //VIEW DETAILS BUTTON LOGIC
  _openDetails(index) {
    const idx = Number(index);
    if (Number.isNaN(idx) || !this.artworks || !this.artworks[idx]) return;
    this.showGrid = false;
    this.loadArtworkByIndex(idx);
    this.requestUpdate();
  }


  //BACK TO GALLERY BUTTON LOGIC
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
    localStorage.setItem('likedArtworks', JSON.stringify(this.artworks.map(a => a.liked || false)));
  }
}


//====================================================================================
//URL STUFF
async connectedCallback() {
  super.connectedCallback();
  await this._loadAllArtworks();

  // Restore likes from localStorage
  const savedLikes = JSON.parse(localStorage.getItem("likedArtworks") || "[]");
  this.artworks.forEach((art, i) => (art.liked = savedLikes[i] || false));

  // Determine which artwork to show
  const params = new URLSearchParams(window.location.search);
  const artIndexParam = Number(params.get("artIndex"));
  const savedIndex = Number(localStorage.getItem("lastArtworkIndex"));

  const indexToShow =
    !Number.isNaN(artIndexParam) && this.artworks[artIndexParam]
      ? artIndexParam
      : !Number.isNaN(savedIndex)
      ? savedIndex
      : null;

  if (indexToShow !== null) {
    this.loadArtworkByIndex(indexToShow);
    this.showGrid = false;
  } else {
    this.showGrid = true;
  }
}

//UPDATE URL LOGIC (ARTINDEX=X)
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

//ADDS THE ART INDEX TO THE URL SO I CAN USE SHARE BUTTON
_copyLink() {
  const currentIndex = Number(this.imageIndex) || 0;
  const url = new URL(window.location.href);
  url.searchParams.set("artIndex", currentIndex); // add art index

  navigator.clipboard.writeText(url.toString())
    .then(() => {
      const tooltip = this.shadowRoot.querySelector("#copy-tooltip");
      tooltip.classList.add("show");
      setTimeout(() => {
        tooltip.classList.remove("show");
      }, 2000);
    })
    .catch(err => console.error("Failed to copy link:", err));
}
//====================================================================================

//CSS
static get styles() {
    return [
      super.styles,
      css`
      /* HOST CSS */
       :host {
  display: block;
  width: 100vw;
  height: auto;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: black;
  color: white;
}

/*  Bio section styles  */
.bio-section {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: left;
  gap: 48px;
  padding: 72px;
  background-color: black;
  color: white;
  box-sizing: border-box;
}

/* IMAGE OF BASQUIAT */
.bio-section img {
  width: 400px;
  height: auto;
  object-fit: cover;
  padding-left: 24px;
}

/* BASQUIAT BIO */
.bio-text {
  max-width: 800px;
  font-size: 16px;
  line-height: 1;
  font-weight: 100;
  color: white;
  text-align: left;
}

/* BASQUIAT BIO HEADING */
.bio-text h2 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 24px;
  margin-bottom: 12px;
}

/* CONTENT ON IMAGE DETAILS PAGE */
.content-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 32px;
  width: 100%;
  padding: 72px;
  background-color: black;
  color: white;
  box-sizing: border-box;
}

.buttons {
  display: flex;
  justify-content: center;
}

/* IMAGE IN IMAGE DETAILS PAGE */
.image-container {
  flex: 1;
  max-width: 100%;
  height: 800px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  overflow: hidden;
}

/* IMAGE CSS  */
.image-container img {
  width: auto;
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: top right;
}

/* JEAN-MICHEL BASUIAT(YEAR) TEXT IN IMAGE VIEW */
.text-section {
  flex: 1;
  text-align: left;
  color: white;
  max-width: 100%;
}

/* TITLE IN IMAGE VIEW SCREEN */
#title {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-style: italic;
  color: white;
  font-size: 64px;
}

/* BASQUIAT(YEAR) IN IMAGE VIEW */
#artist-year {
  font-size: 32px;
  margin-bottom: 12px;
  font-weight: 400;
}

/* DESCRIPTION IN IMAGE VIEW */
.description-container {
  font-size: 14px;
  letter-spacing: 2px;
  font-weight: 100;
  color: white;
  max-height: 500px;
  overflow-y: auto;
  text-align: left;
}

/* MEDIUM, DIMENSIONS, PRICE CONTAINER */
.price-container {
  background-color: black;
  border: 1px solid white;
  padding: 12px;
  border-radius: 4px;
  margin-top: 16px;
  font-size: 16px;
  color: white;
  max-width: 500px;
}

.price-container p {
  margin: 4px 0;
}


/* IMAGE INDEX NUMBER */
.imageIndex-container {
  font-size: 24px;
  font-weight: 100;
  color: white;
}

/* BACK TO GALLERY, SHARE, LIKE BUTTON ROW */
.button-row {
  display: flex;
  gap: 12px;
  justify-content: left;
  flex-wrap: wrap;
  align-items: center;
}

/* "BACK TO GALLERY" AND "SHARE" BUTTONS */
.back-to-gallery,
.share-btn {
  padding: 8px 16px;
  font-size: 16px;
  border: 1px solid white;
  border-radius: 6px;
  background-color: black;
  color: white;
  cursor: pointer;
}

.back-to-gallery:hover,
.share-btn:hover {
  background-color: white;   
  color: black;             
  transform: scale(1.05);   
}

/* Tooltip for copied link */
#copy-tooltip {
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  color: black;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  white-space: nowrap;
}

#copy-tooltip.show {
  opacity: 1;
}


/* ARROW BUTTONS FOR IMAGE INDEX */
.arrow-btn {
  font-size: 30px;
  border: none;
  background-color: transparent;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.arrow-btn:hover {
  transform: scale(1.1);
}

/* Gallery Grid  */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 500px);
  gap: 16px;
  width: 100%;
  background-color: black;
  padding: 4px;
}

/* FRAME FOR EACH GRIDE SECTION */
.frame {
  background-color: black;
  padding: 24px;
  text-align: center;
  color: white;
}

/* IMAGE FRAME WITHIN THE FRAME */
.frame img {
  width: 475px;
  height: 375px;
  object-fit: cover;
}

/* TITLE WITHING THE GRID FRAME */
.frame h4 {
  font-family: 'Playfair Display', serif;
  color: white;
  margin: 12px 6px;
  font-size: 48px;
  font-weight: 100;
  font-style: italic;
}

/* VIEW DETAILS BUTTON IN THE GRID */
.view-details-button {
  margin-top: 8px;
  padding: 8px 16px;
  font-size: 16px;
  border: 1px solid white;
  border-radius: 6px;
  cursor: pointer;
  background-color: black;
  color: white;
}

/* HOVER FOR VIEW DETAILS BUTTON */
.frame button:hover {
  background-color: white;   
  color: black;             
  transform: scale(1.05);    
}

/* PAGE HEADING */
.archive-heading {
  font-family: 'Playfair Display', serif;
  background-color: black;
  color: white;
  text-align: center;
  font-size: 72px;
  margin: 0;
  padding-top: 72px;
  padding-bottom: 48px;
}

/*  MOBILE RESPONSIVE CHANGES  */
@media (max-width: 900px) {
  /* Bio section */
  .bio-section {
    flex-direction: column;
    align-items: center;
    padding: 32px;
    text-align: center;
  }

  .bio-text {
    text-align: center;
    font-size: 16px;
  }

  .bio-section img {
    width: 100%;
    max-width: 400px;
  }

  /* Detail view */
  .content-row {
    flex-direction: column; /* stack image above text */
    align-items: center;
    padding: 32px;
  }

  .image-container {
    max-width: 100%;
    height: auto; /* prevent image from shrinking too much */
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow: hidden;
  }

  .image-container img {
    width: auto; 
    height: 100%; 
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
//==================================================================================


//=================================================================================
//HTML
  render() {


    const currentIndex = Number(this.imageIndex) || 0;
    const currentLiked = this.artworks?.[currentIndex]?.liked || false;

   
    const heading = html`<h1 class="archive-heading">Jean-Michel Basquiat Archive</h1>`;

    // BIO SECTION
    const bioSection = html`
      <section class="bio-section">
        <img
          src="https://photos.airmail.news/epi9oocf8v0p1y4ge8t2o25oylky-b8c0b52c72359b82160ec2844ad33719.jpg"
          alt="Jean-Michel Basquiat portrait"
        />
        <div class="bio-text">
          <h2>Jean-Michel Basquiat (1960–1988)</h2>
          <p>
            Jean-Michel Basquiat was an American artist best known for his raw, expressive paintings that combined text, imagery, and social commentary. Born in Brooklyn, New York, to a Haitian father and Puerto Rican mother, his heritage profoundly influenced his work.
          </p>
          <p>
            Basquiat first gained attention in the late 1970s through graffiti under the name <strong>SAMO©</strong>. By the early 1980s, he rose to international fame with a unique fusion of neo-expressionism, symbolism, and cultural critique—often exploring themes of race, identity, and power.
          </p>
          <p>
            He collaborated with Andy Warhol and became a defining figure of the New York art scene. Despite his success, Basquiat struggled with fame and addiction. He died of a heroin overdose on August 12, 1988, at just 27 years old.
          </p>
          <p>
            Today, his works are among the most celebrated and valuable pieces of contemporary art, symbolizing the intersection of street culture, high art, and the Black experience in America.
          </p>
        </div>
      </section>
    `;


    // GALLERY GRID VIEW 
    if (this.showGrid) {
      return html`
        ${heading}
        ${bioSection}
        <div class="content-row">
          <div class="grid">
            ${this.artworks && this.artworks.length
              ? this.artworks.map(
                  (art, i) => html`
                    <div class="frame"> 
                     
                    <!-- IMAGES AND TITLES IN THE GRID VIEW -->
                      <img 
                        src="${art.image || ""}"
                        alt="${art.title || "Untitled"}"
                        loading="lazy"
                      />
                     
                      <!-- THE VIEW INFO BUTTON IN THE GRID -->
                      <h4>${art.title || "Untitled"}</h4>
                      <button class="view-details-button" @click=${() => this._openDetails(i)}>
                        view details
                      </button>                 
                    </div>
                  `)
              : html`<div>Loading artworks…</div>`}
          </div>
        </div>
      `;}


    //  DETAIL VIEW AFTER CLICKING MORE BUTTON 
    return html`
      ${heading}
      <div class="content-row">
        <div class="image-container">
          <img id="image" src=${this.imageSrc} alt=${this.title} />
        </div>

        <div class="text-section">
          <div class="button-row">

            <!-- LIKE, BACK TO GALLERY, and SHARE BUTTONS -->
            <my-like-button
              likeIndex="${this.imageIndex}"
              ?liked=${currentLiked}
              @liked=${this._handleLike}
            ></my-like-button>

            <!-- BACK TO GALLERY -->
            <button class="back-to-gallery" @click=${this._backToGrid}>
              back to gallery
            </button>

            <!-- SHARE -->
            <button class="share-btn" @click=${this._copyLink}>
            Share
            <span id="copy-tooltip">Link copied!</span>
          </button>
            <div class="imageIndex-container">
          <button class="arrow-btn" @click=${this.showPreviousArtwork}>←</button>
          <span>${currentIndex + 1}</span>
          <button class="arrow-btn" @click=${this.showNextArtwork}>→</button>
        </div>
       </div>

          

       <!-- TITLE, ARTIST(YEAR) -->
          <h3 id="title">${this.title}</h3>
          <div id="artist-year">
            ${this.artist ? `${this.artist}` : ""} ${this.year ? `(${this.year})` : ""}
          </div>

        <!-- DESCRIPTION -->
          <div class="description-container">
            ${this.description ? this.description : ""}
          </div>

          <!-- MEDIUM, DIMENSIONS, PRICE BOX -->
          <div class="price-container">
            <p><strong>Medium:</strong> ${this.medium}</p>
            <p><strong>Dimensions:</strong> ${this.dimensions}</p>
            <p>
              <strong>Price:</strong>
              ${this.price !== "Undisclosed"
                ? this.price.startsWith("$")
                  ? this.price
                  : "$" + this.price
                : "Undisclosed"}
            </p>
          </div>
        </div>
    `;
  }


  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(ImageProject.tag, ImageProject);
