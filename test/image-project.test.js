import { html, fixture, expect } from '@open-wc/testing';
import "../image-project.js";

describe("ImageProject test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <image-project
        title="title"
      ></image-project>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
