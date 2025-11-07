// … your imports remain the same …
import "./my-like-button.js";
import "./my-dislike-button.js";
import "./my-share-button.js";

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
      showGrid: { type: Boolean },
    };
  }

  // … keep all your styles as-is …

  render() {
    const currentIndex = Number(this.imageIndex) || 0;
    const currentLiked = this.artworks?.[currentIndex]?.liked || false;

    const heading = html`<h1 class="archive-heading">Jean-Michel Basquiat Archive</h1>`;

    const bioSection = html`
      <section class="bio-section">
        <img
          src="https://photos.airmail.news/epi9oocf8v0p1y4ge8t2o25oylky-b8c0b52c72359b82160ec2844ad33719.jpg"
          alt="Jean-Michel Basquiat portrait"
        />
        <div class="bio-text">
          <!-- bio text as-is -->
        </div>
      </section>
    `;

    // ======= GRID VIEW =======
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
                      <img 
                        src="${art.image || ""}" 
                        alt="${art.title || "Untitled"}" 
                        loading="lazy" 
                      />
                      <h4>
                        ${art.title || "Untitled"} ${art.liked ? "❤️" : ""}
                      </h4>
                      <button class="view-details-button" @click=${() => this._openDetails(i)}>
                        view details
                      </button>
                    </div>
                  `
                )
              : html`<div>Loading artworks…</div>`}
          </div>
        </div>
      `;
    }

    // ======= DETAIL VIEW =======
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

            <button class="back-to-gallery" @click=${this._backToGrid}>
              back to gallery
            </button>

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

          <h3 id="title">${this.title}</h3>
          <div id="artist-year">
            ${this.artist ? `${this.artist}` : ""} ${this.year ? `(${this.year})` : ""}
          </div>

          <div class="description-container">${this.description || ""}</div>

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
    `;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this._loadAllArtworks();

    // Load likes from localStorage
    const savedLikes = JSON.parse(localStorage.getItem("likedArtworks") || "[]");
    this.artworks.forEach((art, i) => {
      art.liked = savedLikes[i] || false;
    });

    // Handle artIndex in URL
    const params = new URLSearchParams(window.location.search);
    const artIndexParam = Number(params.get("artIndex"));
    if (!Number.isNaN(artIndexParam) && this.artworks[artIndexParam]) {
      this.loadArtworkByIndex(artIndexParam);
      this.showGrid = false;
    } else {
      const savedIndex = Number(localStorage.getItem("lastArtworkIndex"));
      if (!Number.isNaN(savedIndex)) {
        this.loadArtworkByIndex(savedIndex);
      } else {
        this.showGrid = true;
      }
    }
  }

  _handleLike(e) {
    const { liked, index } = e.detail;
    const idx = Number(index);
    if (Number.isNaN(idx)) return;
    if (this.artworks && this.artworks[idx]) {
      this.artworks[idx].liked = liked;
      localStorage.setItem(
        "likedArtworks",
        JSON.stringify(this.artworks.map((a) => a.liked || false))
      );
      this.requestUpdate(); // immediately re-render
    }
  }

  // … keep all your other methods (loadArtworkByIndex, showNextArtwork, showPreviousArtwork, etc.) unchanged …
}

globalThis.customElements.define(ImageProject.tag, ImageProject);
