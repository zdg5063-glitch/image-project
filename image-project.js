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

  // Scroll to the top of the page
  window.scrollTo(0, 0);
  }


  //BACK TO GALLERY BUTTON LOGIC
  _backToGrid() {
    this.showGrid = true;
    this.requestUpdate();
    window.scrollTo(0, 0);
  }

//LIKES LOGIC
_handleLike(e) {
  const idx = Number(e.detail.index); // the index from the button
  const liked = e.detail.liked;

  if (Number.isNaN(idx)) return;

  if (this.artworks && this.artworks[idx]) {
    this.artworks[idx].liked = liked;
    // Save likes for all artworks in localStorage
    localStorage.setItem(
      'likedArtworks',
      JSON.stringify(this.artworks.map(a => a.liked || false))
    );
    this.requestUpdate();
  }
}



//====================================================================================
//URL STUFF
async connectedCallback() {
  super.connectedCallback();
  await this._loadAllArtworks();

  // Step 3: Restore likes from localStorage
  const savedLikes = JSON.parse(localStorage.getItem("likedArtworks") || "[]");
  this.artworks.forEach((art, i) => {
    art.liked = savedLikes[i] || false;
  });

  // Determine which artwork to show
  const params = new URLSearchParams(window.location.search);
  const artIndexParam = Number(params.get("artIndex"));
  const savedIndex = Number(localStorage.getItem("lastArtworkIndex"));

  const indexToShow =
    !Number.isNaN(artIndexParam) && this.artworks[artIndexParam - 1]
      ? artIndexParam - 1
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
      params.set("artIndex", String(index + 1));
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
/* HOST CSS */
:host {
  display: block;
  width: 100vw;
  height: auto;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: black;
  color: var(--ddd-theme-default-slateMaxLight);
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
  color: var(--ddd-theme-default-slateMaxLight);
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
  color: var(--ddd-theme-default-slateMaxLight);
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
  color: var(--ddd-theme-default-slateMaxLight);
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

/* JEAN-MICHEL BASQUIAT(YEAR) TEXT IN IMAGE VIEW */
.text-section {
  flex: 1;
  text-align: left;
  color: var(--ddd-theme-default-slateMaxLight);
  max-width: 100%;
}

/* TITLE IN IMAGE VIEW SCREEN */
#title {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-style: italic;
  color: var(--ddd-theme-default-slateMaxLight);
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
  color: var(--ddd-theme-default-slateMaxLight);
  max-height: 500px;
  overflow-y: auto;
  text-align: left;
}

/* MEDIUM, DIMENSIONS, PRICE CONTAINER */
.price-container {
  background-color: black;
  border: 1px solid var(--ddd-theme-default-slateMaxLight);
  padding: 12px;
  border-radius: 4px;
  margin-top: 16px;
  font-size: 16px;
  color: var(--ddd-theme-default-slateMaxLight);
  max-width: 500px;
}

.price-container p {
  margin: 4px 0;
}

/* IMAGE INDEX NUMBER */
.imageIndex-container {
  font-size: 24px;
  font-weight: 100;
  color: var(--ddd-theme-default-slateMaxLight);
}

/* BACK TO GALLERY, SHARE, LIKE BUTTON ROW */
.button-row {
  display: flex;
  gap: 12px;
  justify-content: left;
  flex-wrap: wrap;
  align-items: center;
}

/* "SHARE" BUTTON */
.share-btn {
  padding: 8px 16px;
  font-size: 16px;
  border: 1px solid var(--ddd-theme-default-slateMaxLight);
  border-radius: 6px;
  background-color: black;
  color: var(--ddd-theme-default-slateMaxLight);
  cursor: pointer;
}

.share-btn:hover {
  background-color: var(--ddd-theme-default-slateMaxLight);
  color: black;
  transform: scale(1.05);
}

/* Tooltip for copied link */
#copy-tooltip {
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--ddd-theme-default-slateMaxLight);
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

/* BACK TO GALLERY */
.back-to-gallery {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 16px;
  color: var(--ddd-theme-default-slateMaxLight);
  background: transparent;
  border: 1px solid var(--ddd-theme-default-slateMaxLight);
  border-radius: 6px;
  cursor: pointer;
}

.back-to-gallery:hover {
  background: var(--ddd-theme-default-slateMaxLight);
  color: black;
  transform: scale(1.03);
}

.icon-grid {
  width: 20px;
  height: 20px;
  display: inline-block;
  flex: 0 0 auto;
}

/* ARROW BUTTONS FOR IMAGE INDEX */
.arrow-btn {
  font-size: 30px;
  border: none;
  background-color: transparent;
  color: var(--ddd-theme-default-slateMaxLight);
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

/* FRAME FOR EACH GRID SECTION */
.frame {
  height: 800px;
  background-color: black;
  padding: 24px;
  text-align: center;
  color: var(--ddd-theme-default-slateMaxLight);
}

/* IMAGE FRAME WITHIN THE FRAME */
.frame img {
  width: 475px;
  height: 500px;
  object-fit: cover;
}

/* TITLE WITHIN THE GRID FRAME */
.frame h4 {
  font-family: 'Playfair Display', serif;
  color: var(--ddd-theme-default-slateMaxLight);
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
  border: 1px solid var(--ddd-theme-default-slateMaxLight);
  border-radius: 6px;
  cursor: pointer;
  background-color: black;
  color: var(--ddd-theme-default-slateMaxLight);
}

/* HOVER FOR VIEW DETAILS BUTTON */
.frame button:hover {
  background-color: var(--ddd-theme-default-slateMaxLight);
  color: black;
  transform: scale(1.05);
}

/* PAGE HEADING */
.archive-heading {
  font-family: 'Playfair Display', serif;
  background-color: black;
  color: var(--ddd-theme-default-slateMaxLight);
  text-align: center;
  font-size: 72px;
  margin: 0;
  padding-top: 72px;
  padding-bottom: 48px;
}

/*  MOBILE RESPONSIVE CHANGES  */
@media (max-width: 900px) {
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

  .content-row {
    flex-direction: column;
    align-items: center;
    padding: 32px;
  }

  .image-container {
    max-width: 100%;
    height: auto;
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

.imageIndex-container {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 100;
  color: var(--ddd-theme-default-slateMaxLight);
}

.arrow-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: transform 0.2s ease, color 0.2s ease;
  color: var(--ddd-theme-default-slateMaxLight);
}

.arrow-btn:hover {
  transform: scale(1.2);
  color: #ffcc00;
}

.arrow-btn svg {
  display: block;
  width: 28px;
  height: 28px;
}

.bottom-crown {
  display: block;
  margin: 0 auto;
  height: 250px;
  width: 250px;
  padding-top: 333px;
  padding-bottom: 72px;
}

.crown-wrapper {
  display: flex;
  justify-content: center;
}

/* Liked artworks heading */
.liked-heading {
  font-size: 24px;
  padding-left: 72px;
  margin-bottom: 8px;
  color: var(--ddd-theme-default-slateMaxLight);
}

/* Liked artworks grid */
.liked-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px 12px;
  margin-bottom: 16px;
  padding-left: 72px;
  padding-right: 100px;
}

/* Liked artworks frame */
.liked-grid .frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0;
  margin: 12px;
  background-color: black;
  height: auto;
  color: var(--ddd-theme-default-slateMaxLight);
}

.liked-grid .frame img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  display: block;
  margin-bottom: 4px;
}

/* Hide titles in liked artworks */
.liked-grid .frame h4 {
  display: none;
}

/* View details button smaller */
.liked-grid .frame .view-details-button {
  padding: 4px 8px;
  font-size: 13px;
  border: 1px solid var(--ddd-theme-default-slateMaxLight);
  color: var(--ddd-theme-default-slateMaxLight);
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .liked-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 6px 8px;
    padding-left: 16px;
    padding-right: 16px;
  }

  .liked-grid .frame img {
    width: 80px;
    height: 80px;
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

  // LIKED ARTWORKS SECTION
  const likedArtworks = html`
    ${this.artworks.some(a => a.liked)
      ? html`
          <h2 class="liked-heading">Your Favorites</h2>
          <div class="grid liked-grid">
            ${this.artworks
              .map((art, i) => ({ art, i }))
              .filter(a => a.art.liked)
              .map(
                ({ art, i }) => html`
                  <div class="frame">
                    <img src="${art.image}" alt="${art.title}" loading="lazy" />
                    <button class="view-details-button" @click=${() => this._openDetails(i)}>
                      view details
                    </button>
                  </div>
                `
              )}
          </div>
        `
      : null}
  `;

  // GALLERY GRID VIEW 
  if (this.showGrid) {
    return html`
      ${heading}
      ${bioSection}
      ${likedArtworks} <!-- inserted here -->
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
                    <button class="view-details-button" @click=${() => this._openDetails(i)}>
                      view details
                    </button>
                  </div>
                `
              )
            : html`<div>Loading artworks…</div>`}
        </div>
      </div>
      <img
        src="https://atticcapital.com/wp-content/uploads/2022/02/basquiat-crown.png"
        alt="Basquiat Crown"
        class="bottom-crown"
      />
    `;
  }

  // DETAIL VIEW AFTER CLICKING MORE BUTTON 
  return html`
    ${heading}
    <div class="content-row">
      <div class="image-container">
        <img id="image" src=${this.imageSrc} alt=${this.title} />
      </div>

      <div class="text-section">
        <div class="button-row">

         <!-- BACK TO GALLERY -->
          <button class="back-to-gallery" @click=${this._backToGrid} aria-label="Back to gallery">
            <svg class="icon-grid" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"></rect>
              <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"></rect>
              <rect x="17" y="1" width="6" height="6" rx="1" fill="currentColor"></rect>
              <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"></rect>
              <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"></rect>
              <rect x="17" y="9" width="6" height="6" rx="1" fill="currentColor"></rect>
              <rect x="1" y="17" width="6" height="6" rx="1" fill="currentColor"></rect>
              <rect x="9" y="17" width="6" height="6" rx="1" fill="currentColor"></rect>
              <rect x="17" y="17" width="6" height="6" rx="1" fill="currentColor"></rect>
            </svg>
            <span>Back to Gallery</span>
          </button>

          <!-- SHARE -->
          <button class="share-btn" @click=${this._copyLink}>
            Share
            <span id="copy-tooltip">Link copied!</span>
          </button>

          <!-- LIKE BUTTON -->
          <my-like-button
            .likeIndex=${currentIndex}
            ?liked=${currentLiked}
            @liked=${this._handleLike}
          ></my-like-button>

          <div class="imageIndex-container">
            <!-- Previous Arrow -->
            <button class="arrow-btn" @click=${this.showPreviousArtwork} aria-label="Previous">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
              </svg>
            </button>

            <!-- Current Index -->
            <span>${currentIndex + 1}</span>

            <!-- Next Arrow -->
            <button class="arrow-btn" @click=${this.showNextArtwork} aria-label="Next">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
              </svg>
            </button>
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
    </div>
    
    </div>
  `;
}


  
  


  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(ImageProject.tag, ImageProject);
